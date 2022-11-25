using CELSIS.Api.Data;
using CELSIS.Api.Data.Entities;
using CELSIS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using System;

namespace CELSIS.Api.Controllers
{
    [ApiController]
    [Route("api")]
    public class RatingController : ControllerBase
    {
        private readonly CelsisDbContext _dbContext;

        public RatingController(CelsisDbContext dbContext)
        {
            if (dbContext == null)
                throw new ArgumentNullException(nameof(dbContext));

            _dbContext = dbContext;
        }

        [HttpPost("ratePlace")]
        public async Task<ActionResult> RatePlaceAsync(RatePlaceModel rateModel)
        {
            if (rateModel == null)
                return BadRequest("Request body is empty");

            var rating = await _dbContext.PlaceRatings.FindAsync(rateModel.GooglePlaceId);

            if (rating == null)
            {
                rating = new PlaceRating
                {
                    GooglePlaceId = rateModel.GooglePlaceId,
                    Rating = rateModel.Rating,
                    RatingCount = 1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _dbContext.PlaceRatings.Add(rating);
            }
            else
            {
                rating.Rating = (rating.Rating * rating.RatingCount + rateModel.Rating) / (rating.RatingCount + 1);
                rating.RatingCount += 1;
            }

            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("rateRoute")]
        public async Task<ActionResult> RateRouteAsync(RateRouteModel rateModel)
        {
            if (rateModel == null)
                return BadRequest("Request body is empty");

            var rating = await _dbContext.RouteRatings.FindAsync(rateModel.GoogleRouteHash);

            if (rating == null)
            {
                rating = new RouteRating
                {
                    GoogleRouteHash = rateModel.GoogleRouteHash,
                    Rating = rateModel.Rating,
                    RatingCount = 1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _dbContext.RouteRatings.Add(rating);
            }
            else
            {
                rating.Rating = (rating.Rating * rating.RatingCount + rateModel.Rating) / (rating.RatingCount + 1);
                rating.RatingCount += 1;
            }

            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("getPlaceRating/{googlePlaceId}")]
        public async Task<ActionResult<float>> GetPlaceRatingAsync(string googlePlaceId)
        {
            if (googlePlaceId == null || googlePlaceId.Length == 0)
                return BadRequest($"{nameof(googlePlaceId)} does not provided");

            var rating = await _dbContext.PlaceRatings.FindAsync(googlePlaceId);

            if (rating == null)
                return BadRequest($"Place with id: {googlePlaceId} does not exist in DB");

            return Ok(rating.Rating);
        }

        [HttpGet("getRouteRating/{googleRouteHash}")]
        public async Task<ActionResult<float>> GetRouteRatingAsync(string googleRouteHash)
        {
            if (googleRouteHash == null || googleRouteHash.Length == 0)
                return BadRequest($"{nameof(googleRouteHash)} does not provided");

            var rating = await _dbContext.RouteRatings.FindAsync(googleRouteHash);

            if (rating == null)
                return BadRequest($"Route with hash: {googleRouteHash} does not exist in DB");

            return Ok(rating.Rating);
        }

        [HttpPost("selectBestRoute")]
        public async Task<ActionResult<string>> SelectBestRoute(List<SelectRouteModel> routes)
        {
            float maxRouteOverallRating = 0;
            string bestRouteHash = null;

            foreach (var route in routes)
            {
                float routeCumulativeRating = 0;

                foreach (var place in route.Places)
                {
                    var placeRatingEntity = await _dbContext.PlaceRatings.FindAsync(place.GooglePlaceId);

                    if (placeRatingEntity == null)
                    {
                        routeCumulativeRating += place.GoogleRating;
                    }
                    else
                    {
                        float internalRating = placeRatingEntity.Rating;
                        routeCumulativeRating += (place.GoogleRating + internalRating) / 2;
                    }
                }

                float routeOverallRating = routeCumulativeRating / route.Places.Count();

                if (routeOverallRating > maxRouteOverallRating)
                {
                    maxRouteOverallRating = routeOverallRating;
                    bestRouteHash = route.GoogleRouteHash;
                }
            }

            if (bestRouteHash == null)
                return Problem("No best routes");

            return Ok(bestRouteHash);
        }

        [HttpPost("buildRoute")]
        public async Task<ActionResult<ResultRouteModel>> BuildRouteAsync(BuildRouteModel buildRouteModel)
        {
            if (buildRouteModel == null)
                return BadRequest($"{nameof(buildRouteModel)} does not provided");

            var internalRatings = new List<float?>();

            foreach (var place in buildRouteModel.Places)
            {
                var placeRatingEntity = await _dbContext.PlaceRatings.FindAsync(place.GooglePlaceId);

                if (placeRatingEntity != null)
                    place.OverallRating = (placeRatingEntity.Rating + place.GoogleRating) / 2;
                else
                    place.OverallRating = place.GoogleRating;
            }

            var result = buildRouteModel.Places
                .OrderByDescending(place => place.OverallRating)
                .Take(buildRouteModel.PlaceCount)
                .ToList();

            return Ok(
                new ResultRouteModel { Places = result }
            );
        }
    }
}
