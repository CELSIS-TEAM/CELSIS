interface IApiRoutes {
    getPlaceRating: (placeId: string) => string;
    ratePlace: () => string;
    buildRoute: () => string; 
}

const apiUrl = "http://20.160.227.44:8080"

const apiRoutes: IApiRoutes = {
    getPlaceRating: (placeId) => `${apiUrl}/api/getPlaceRating/${placeId}`,
    ratePlace: () => `${apiUrl}/api/ratePlace`,
    buildRoute: () => `${apiUrl}/api/buildRoute`
}

export default apiRoutes;