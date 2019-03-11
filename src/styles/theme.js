import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
    accent: "#786CB2",
    background: "#E4E4E1",
    text: "#2C2C29"
}

export default createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette
});