import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    rootLink: {
        "& > * + *": {
            marginLeft: theme.spacing(2),
        },
        margin: "auto"
    },
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    links: {
        color: "white",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "none",
            color: "white",
        },
        marginLeft: "15px",
    },
    lang: {

    },
}))

export default useStyles