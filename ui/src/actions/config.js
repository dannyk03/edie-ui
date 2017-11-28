const getServerURL = () => {
    return window.location.port === '3000' ? 'http://imp-dev.securegion.com' : window.location.origin;
}

export const ROOT_URL = getServerURL()

export const EDDIE_URL = 'http://eddie.securegion.com:8891'