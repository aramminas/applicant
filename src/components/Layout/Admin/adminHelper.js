export const getPathId = (path) => {
    switch(path) {
        case "dashboard":
            return 1
        case "applicants":
            return 2
        case "test-results":
            return 3
        case "admin-tests":
            return 4
        case "create-test":
            return 5
        case "css-effects":
            return 6
        default:
            switch(true) {
                case /^edit-view*/.test(path):
                    return 4
                default:
                    return 0
            }
    }
}