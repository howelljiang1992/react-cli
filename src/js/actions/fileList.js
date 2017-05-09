import {CLEAN_ARTICLE_FILELIST, CLEAN_BANNER_FILE, SET_ARTICLE_FILELIST, SET_BANNER_FILE, CLEAN_BANNER_FILELIST, CLEAN_FILE, GET_POS} from '../constants/Actions'

export function cleanBannerFile(position = 0) {
    return {
        type: CLEAN_BANNER_FILE,
        position
    }
}

export function cleanBannerFileList() {
    return {
        type: CLEAN_BANNER_FILELIST
    }
}

export function setBannerFile(file, position = 0) {
    return {
        type: SET_BANNER_FILE,
        file,
        position
    }
}

export function cleanFile(file) {
    return {
        type: CLEAN_FILE,
        file
    }
}

export function getPos(file) {
    return {
        type: GET_POS,
        file
    }
}
