import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CelsisGlobalStateProvider from './components/CelsisGlobalStateProvider';
import CustomMap from './components/CustomMap';

const theme = createTheme({
    components: {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    background: "#E3E3E3",
                    borderRadius: 30
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    borderRadius: 20
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: "white",
                    borderRadius: 20
                }
            }
        }
    },
    palette: {
        primary: {
            main: "#005551",
        },
        secondary: {
            main: '#11cb5f',
        },
    },
});

function App() {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <CelsisGlobalStateProvider>
                    <CustomMap />
                </CelsisGlobalStateProvider>
            </ThemeProvider>
        </div>
    );
}

export default App;
