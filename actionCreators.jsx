import {
    LOADER,
    GET_GLOBAL_METRIC,
    STATEMENT_LISTING,
    SELECTED_LISTING,
    GET_TIERS,
    SAVE_TOKEN,
    SAVE_REQUIRED,
    FILTER_LISTING,
    SELECTED_AREA,
    CLIENT_METRIC_DATA,
    CLIENT_HEADING,
    ACTIVE_METRIC,
    ACTIVE_METRIC_VALUE,
    CLIENT_PSYCHO_POINTS,
    CLIENT_DEMO_POINTS,
    CLIENT_TOTAL_POINTS,
    CET_CLIENTS,
    GET_IDEAS,
    CLIENT_VALUE_GRID,
    USER_PROFILE,
    EMPTY_REDUX_DATA
} from "./types";

import moment from 'moment'

import { postDataApi, getDataApi, putDataApi, delDataApi, authDataApi } from "./../../utils/Apis";

import { Store } from 'react-notifications-component';
import { getResponsiblePersonData } from "./ListActions";



/**
 * post request to server for authentication
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const postLogin = (data, secreteKey) => async (dispatch) => {

    await authDataApi("wow-login", data)
        .then(async response => {

            if (response?.data?.token){
                saveToken(response?.data, dispatch, secreteKey)
                dispatch(getUserProfile())
            }else{
                saveToken(response?.data, dispatch, secreteKey)
            }
            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            saveToken(error?.response?.data, dispatch, secreteKey)
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * post request to server for authentication
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
 export const verifyAuthToken = (data, userProfile, navigate) => async (dispatch) => {

    await authDataApi("verify-auth-token", data)
        .then(async response => {

            if (!response?.data?.status){
                dispatch(updatePassportToken(response?.data?.token))
                navigate('/authentication/'+getAccessToken())
            }
            if( !userProfile )
            dispatch(getUserProfile())
        })
        .catch(error => {
        });
}

/**
 * post request to server for authentication
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
 export const getUserProfile = () => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi("profile")
        .then(async response => {

            if (response?.data?.user) {
                dispatch({
                    type: USER_PROFILE,
                    payload: response?.data?.user,
                });
            }

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * post request to server for authentication
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const getGlobalMetric = () => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi("admin/admin-metric-areas")
        .then(async response => {

            if (response?.data?.status) {
                dispatch({
                    type: GET_GLOBAL_METRIC,
                    payload: response?.data?.data,
                });
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * post request to server for authentication
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const addGlobalMetric = (data, getGlobalMetric) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await postDataApi("admin/admin-metric-areas", data)
        .then(async response => {

            if (response?.data?.status) {
                dispatch(getGlobalMetric())
                success(response?.data?.message, 'Warning')
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * put request to server for update metric
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const putGlobalMetric = (data, metricId, getGlobalMetric) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await putDataApi(`admin/admin-metric-areas/${metricId}`, data)
        .then(async response => {

            if (response?.data?.status) {
                dispatch(getGlobalMetric())
                success(response?.data?.message, 'Warning')
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * put request to server for update metric
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const deleteGlobalMetric = (metricId, getGlobalMetric) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await delDataApi(`admin/admin-metric-areas/${metricId}`)
        .then(async response => {

            if (response?.data?.status) {
                dispatch(getGlobalMetric())
                success(response?.data?.message, 'Warning')
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * find all statement listing
 * 
 * @param {*} NA 
 * 
 * @return {*}
 */
export const getStatementListing = (defaultListItem) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi(`listing`)
        .then(async response => {

            if (response?.data?.status) {

                let data = []
                if(response?.data?.data?.length == 0){
                    dispatch({
                        type: SELECTED_LISTING,
                        payload: null 
                    });
                }
                dispatch({
                    type: STATEMENT_LISTING,
                    payload: response?.data?.data,
                });

                if (response?.data?.data?.length && !localStorage.getItem('statementListingData')) {
               
                    let responseData = (response?.data?.data)?.values().next().value
                    dispatch(defaultListItem({ value: responseData?.id, label: `${moment(responseData?.statement_date).format("MM/DD/YYYY")}${responseData?.statement_title ? " - " + responseData?.statement_title:''}` }))
                    // dispatch(defaultListItem({ value: responseData?.id, label: `${moment(responseData?.statement_date).format('MM/DD/YYYY')} - Hello World ia m here` }))
                    
                }
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * find selected statement listing
 * 
 * @param {*} NA 
 * 
 * @return {*}
 */
export const findStatementListing = (listingId) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    if( !listingId ) return false

    await getDataApi(`listing/${listingId}`)
        .then(async response => {

            if (response?.data?.status) {

                let data = []

                let responseData = (response?.data?.data)?.values().next().value

                dispatch({
                    type: FILTER_LISTING,
                    payload: responseData,
                });

                if (responseData) {
                    responseData?.client_metric_data?.map(option => {
                        data?.push(option?.metric_id?.toString())
                    })

                    dispatch({
                        type: SELECTED_AREA,
                        payload: data
                    });
                }
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * find selected statement listing
 * 
 * @param {action} getClientMetricData 
 * 
 * @return {*}
 */
export const recentStatementListing = (getClientMetricData, type) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi(`last-listing-id`)
        .then(async response => {

            if (response?.data?.status) {

                let data = (response?.data?.data)?.values().next().value

                dispatch({
                    type: SELECTED_LISTING,
                    payload: { label: data?.statement_date, value: data?.id },
                });
                dispatch(getClientMetricData(data?.id, type))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * post request to server for add new listing
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const addNewStatementListing = (data, formatedSelectDate , getStatementListing, defaultListItem) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)
 
    await postDataApi(`listing`, data)
        .then(async response => {

            if (response?.data?.status) {
                success(response?.data?.message, 'Success')
                await dispatch(getStatementListing(defaultListItem))
                await dispatch(defaultListItem({ value: response?.data?.data?.id, label: formatedSelectDate }))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * post request to server for add new listing
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const deleteStatementListing = (data, getStatementListing, defaultListItem) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await delDataApi(`listing/${data}`)
        .then(async response => {

            if (response?.data?.status) {

                success(response?.data?.message, 'Success')
                await localStorage.removeItem("statementListingData");
                await dispatch(getStatementListing(defaultListItem))

            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * post request to server for authentication
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const addUserMetric = (data, getUserMetric) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await postDataApi("metric-areas", data)
        .then(async response => {

            if (response?.data?.status) {
                dispatch(getUserMetric())
                success(response?.data?.message, 'Success')
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * post request to server for authentication
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const getUserMetric = () => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi("metric-areas")
        .then(async response => {

            if (response?.data?.status) {
                dispatch({
                    type: GET_GLOBAL_METRIC,
                    payload: response?.data?.data,
                });
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * put request to server for update metric
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const deleteUserMetric = (metricId, getGlobalMetric) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await delDataApi(`metric-areas/${metricId}`)
        .then(async response => {

            if (response?.data?.status) {
                dispatch(getGlobalMetric())
                success(response?.data?.message, 'Success')
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * save user metric data
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const saveUserMetric = (data, findStatementListing) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await postDataApi("client-metric-data", data)
        .then(async response => {

            if (response?.data?.status) {
                success(response?.data?.message, 'Success')
                dispatch(findStatementListing(data?.listing_id))
                /** save action notification */
                dispatch(saveRequired(false))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * post request to server for authentication
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const getTiers = (url) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi(url)
        .then(async response => {

            if (response?.data?.status) {
                /** reset value to update with new data  */
                dispatch({
                    type: GET_TIERS,
                    payload: [],
                });
                dispatch({
                    type: GET_TIERS,
                    payload: response?.data?.data,
                });
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * post request to server for authentication
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
export const updateTiers = (url, data) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await putDataApi(url, { tiers: data })
        .then(async response => {

            if (response?.data?.status) {
                success(response?.data?.message, 'Success')
                getTiers(url)
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}
/**
 * client metric heading data
 * 
 * @param {int} metricType 
 * 
 * @return {*}
 */
export const geMetricHeadingData = (metricType) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi(`metric-headings/${metricType}`)
        .then(async response => {

            if (response?.data?.status) {
                dispatch({
                    type: CLIENT_HEADING,
                    payload: response?.data?.data,
                });
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}
/**
 * post request to server for authentication
 * 
 * @param {int} listingId 
 * 
 * @return {*}
 */
export const getClientMetricData = (listingId, type) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi(`client-metric-data/${listingId}?type=${type}`)
        .then(async response => {

            if (response?.data?.status) {

                let scoreData = response?.data?.data
                let metricData = serializeMetricData(scoreData, type)

                dispatch({
                    type: CLIENT_METRIC_DATA,
                    payload: response?.data?.data,
                });

                dispatch(saveActiveMetricValues(metricData))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * save client metric data
 * 
 * @param {int} listingId 
 * @param {object} data
 * @param {int} type
 * 
 * @return {*}
 */
export const saveClientMetricData = (listingId, data, type) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await putDataApi(`client-metric-data/${listingId}`, data)
        .then(async response => {

            if (response?.data?.status) {
                success(response?.data?.message, 'Success')
                dispatch(getClientMetricData(listingId, type))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * get client score data
 * 
 * @param {int} listingId 
 * 
 * @return {*}
 */
export const getClientScoreData = (listingId, type) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi(`client-scores/${listingId}`)
        .then(async response => {

            if (response?.data?.status) {
                let scoreData = response?.data?.data

                dispatch({
                    type: CLIENT_TOTAL_POINTS,
                    payload: serializeScoreData(scoreData, type),
                });
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 *  serialize metric store data 
 * 
 * @param {object} scoreData 
 * @returns 
 */
const serializeScoreData = (scoreData, type) => {

    let score = []
    scoreData?.map(clients => {

        clients?.client_score?.map(clientScore => {

            if (!score[clients?.id]) score[clients?.id] = []

            score[clients?.id][clientScore?.metric_area_id] = clientScore?.score
        })
    })
    
    return score
}

const serializeMetricData = (scoreData) => {
    
    let score = []

    scoreData?.map(clients => {

        clients?.metric_data?.map(clientScore => {

            score[clientScore?.metric_value_id] = clientScore?.metric_value
        })
    })
    
    return score
}

/**
 * save client score data
 * 
 * @param {int} listingId 
 * @param {object} data
 * @param {int} type
 * 
 * @return {*}
 */
export const saveClientScoreData = (listingId, data) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await putDataApi(`client-scores/${listingId}`, { client_data: data })
        .then(async response => {

            if (response?.data?.status) {
                success(response?.data?.message, 'Success')
                // dispatch(getClientMetricData(listingId, type))

                 /** save action notification */
                dispatch(saveRequired(false))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * get client score data
 * 
 * @param {int} listingId 
 * 
 * @return {*}
 */
 export const getClients = (listingId) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi(`clients/${listingId}`)
        .then(async response => {

            if (response?.data?.status) {

                dispatch({
                    type: CET_CLIENTS,
                    payload: response?.data?.data,
                });
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * get client score data
 * 
 * @param {int} listingId 
 * 
 * @return {*}
 */
 export const addClients = (data) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await postDataApi(`clients`, data)
        .then(async response => {

            if (response?.data?.status) {
                success(response?.data?.message, 'Success')
                dispatch(getClients(data?.listing_id))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * get client score data
 * 
 * @param {int} listingId 
 * 
 * @return {*}
 */
 export const deleteClient = (clientId, listingId) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await delDataApi(`clients/${clientId}`)
        .then(async response => {

            if (response?.data?.status) {

                success(response?.data?.message, 'Success')
                dispatch(getClients(listingId))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * get client idea stuff
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
 export const getIdea = (type) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi(`ideas?idea_type=${type}`)
        .then(async response => {

            if (response?.data?.status) {

                dispatch({
                    type: GET_IDEAS,
                    payload: response?.data?.data,
                });
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * save client idea stuff
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
 export const saveIdea = (data,current_page_type) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await postDataApi(`ideas`, data)
        .then(async response => {

            if (response?.data?.status) {

                success(response?.data?.message, 'Success')
                /** get saved wow idea */
                dispatch(getIdea(current_page_type))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * save Responsible Person
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
 export const saveResponsiblePerson = (data) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await postDataApi(`responsible-persons`, data)
        .then(async response => {
            if (response?.data?.status) {
                success(response?.data?.message, 'Success')
                /** get saved wow idea */
                dispatch(getResponsiblePersonData())
            }
            else
                warning(response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}


/**
 * Update client idea 
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
 export const updateIdea = (data,ideaId,current_page_type) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await putDataApi(`ideas/${ideaId}`, data)
        .then(async response => {

            if (response?.data?.status) {

                success(response?.data?.message, 'Success')
                /** get saved wow idea */
                dispatch(getIdea(current_page_type))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * Update Responsible Person
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
 export const updateResponsiblePerson = (data,responsiblePersonId) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await putDataApi(`responsible-persons/${responsiblePersonId}`, data)
        .then(async response => {
            if (response?.data?.status) {
                success(response?.data?.message, 'Success')
                /** get saved wow idea */
                dispatch(getResponsiblePersonData())
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}

/**
 * save client idea stuff
 * 
 * @param {object} data 
 * 
 * @return {*}
 */
 export const copyOldStatementListingDate = (data,formatedSelectDate , getStatementListing, defaultListItem) => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await postDataApi(`listing/copy`, data)
        .then(async response => {

            if (response?.data?.status) {

                success(response?.data?.message, 'Success');
                await dispatch(getStatementListing(defaultListItem))
                await dispatch(defaultListItem({ value: response?.data?.data?.new_listing_id, label: formatedSelectDate }))
            }
            else
                warning(response?.data?.message, 'Warning')

            /** procesing false */
            processing(dispatch, false)
        })
        .catch(error => {
            /** error message */
            warning(error?.response?.data?.message, 'Warning')
            /** procesing false */
            processing(dispatch, false)
        });
}
/**
 * alert notification component
 *
 * @param {string} title
 * @param {string} message
 */
const success = (message, title) => {
    Store.addNotification({
        title: 'Success',
        message: message,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
};

/**
 * alert notification component
 *
 * @param {string} message
 * @param {string} title
 */
const warning = (message, title) => {
    Store.addNotification({
        title: title,
        message: message,
        type: "warning",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
};

/**
 * loader component
 *
 * @param {function} dispatch
 * @param {boolean} action
 */
export const processing = async (dispatch, action) => {
    if (action)
        document.body.classList.add("overflow-hidden");
    else
        document.body.classList.remove("overflow-hidden");

    dispatch({
        type: LOADER,
        payload: action,
    });
};

/**
 * save passport token
 * 
 * @param {string} token 
 * @return {*}
 */
const saveToken = (data, dispatch, secreteKey) => {

    dispatch({
        type: SAVE_TOKEN,
        payload: data
    });

    localStorage.setItem('passportToken', data?.token);
    localStorage.setItem('secreteKey', secreteKey);
    localStorage.setItem('authUser', JSON.stringify(data));
}
/**
 * save passport token
 * 
 * @param {string} token 
 * @return {*}
 */
 const updatePassportToken = (token) => dispatch => {

    localStorage.setItem('passportToken', token);
}

/**
 * save user auth token
 * 
 * @param {string} token 
 * @return {*}
 */
 const saveUserAuth = (token, dispatch) => {

    dispatch({
        type: SAVE_TOKEN,
        payload: token
    });
}

/**
 * remove passport token
 * 
 * @param {string} token 
 * @return {*}
 */
export const removeToken = () => dispatch => {

    localStorage.removeItem('passportToken');
    localStorage.removeItem('secreteKey');
    dispatch({
        type: SAVE_TOKEN,
        payload: ''
    });
}

/**
 * verify passport token
 * 
 * @param {string} token 
 * @return {*}
 */
const verifyToken = () => {
    return localStorage.getItem('passportToken') ? true : false;
}

export const getToken = () => {

    return verifyToken()
}

/**
 * verify passport token
 * 
 * @param {string} token 
 * @return {*}
 */
export const getPassportToken = () => {
    return localStorage.getItem('passportToken');
}

/**
 * statement listing
 *
 * @param {object} data
 */
export const defaultListItem = (data) => dispatch => {
    dispatch({
        type: SELECTED_LISTING,
        payload: data,
    });
    dispatch(findStatementListing(data?.value))
    localStorage.setItem('statementListingData', JSON.stringify(data));
};

/**
 * action required when input value change
 *
 * @param {object} data
 */
export const saveRequired = (data) => dispatch => {
    dispatch({
        type: SAVE_REQUIRED,
        payload: data,
    });
};

/**
 * user warning notificatio
 * 
 * @param {string} message 
 * @param {string} title 
 */
export const warningMsg = (message, title) => {
    warning(message, title)
}

/**
 * mark saved selected items
 *
 * @param {object} data
 */
export const markSavedItems = (data) => dispatch => {
    dispatch({
        type: SELECTED_AREA,
        payload: data,
    });
};

/**
 * mark saved Active metric
 *
 * @param {object} data
 */
export const saveActiveMetric = (data) => dispatch => {
    dispatch({
        type: ACTIVE_METRIC,
        payload: data,
    });
};

/**
 * mark saved Active metric
 *
 * @param {object} data
 */
export const saveActiveMetricValues = (data) => dispatch => {
    dispatch({
        type: ACTIVE_METRIC_VALUE,
        payload: data,
    });
};

/**
 * save client demographics points
 *
 * @param {object} data
 */
export const saveClientDemoPoints = (data) => dispatch => {
    dispatch({
        type: CLIENT_DEMO_POINTS,
        payload: data,
    });
};

/**
 * save client psychographics points
 *
 * @param {object} data
 */
export const saveClientPsychoPoints = (data) => dispatch => {
    dispatch({
        type: CLIENT_PSYCHO_POINTS,
        payload: data,
    });
};

/**
 * save client total points
 *
 * @param {object} data
 */
export const saveClientTotalPoints = (data) => dispatch => {
    dispatch({
        type: CLIENT_TOTAL_POINTS,
        payload: data,
    });
};

/**
 * save client value grid details
 *
 * @param {object} data
 */
export const saveValueGridData = (data) => dispatch => {

    dispatch({
        type: CLIENT_VALUE_GRID,
        payload: data,
    });
};

/**
 * save access token
 * 
 * @param {string} token 
 * @return {*}
 */
export const saveAccessToken = (token) => dispatch => {
    localStorage.setItem('secreteKey', token);
}

/**
 * save access token
 * 
 * @param {string} token 
 * @return {*}
 */
 export const getAccessToken = () => {
    return localStorage.getItem('secreteKey');
}

/**
 * remove access token
 * 
 * @param {string} token 
 * @return {*}
 */
 export const removeAccessToken = () => dispatch => {

    dispatch({
        type: SAVE_TOKEN,
        payload: ''
    });
    
    localStorage.removeItem('secreteKey');
    localStorage.removeItem('passportToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('statementListingData');
}

export const emptyReduxVariables = () => dispatch => new Promise((resolve, reject) => {
    try{
        dispatch({type: EMPTY_REDUX_DATA});
        resolve();
    }
    catch {
        reject();
    }
})