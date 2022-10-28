import {
  LOADER,
  CLIENT_VALUE_GRID,
  GAP_ANALYSIS_HEADING,
  GAP_ANALYSIS_VALUE,
  TIER_TRACKER_CLIENT,
  TRACKER_IDEAS_LIST,
  TRACKER_HEADING_LIST,
  TRACKER_GRID_DATA,
  GET_IDEAS,
  RESPONSIBLE_PERSONS
} from "./types";

import {
  postDataApi,
  getDataApi,
  putDataApi,
  delDataApi,
} from "./../../utils/Apis";

import { Store } from "react-notifications-component";

/**
 * post request to save relation grid data
 *
 * @param {int} ideaType
 *
 * @return {*}
 */
export const getRelationalGrid = (ideaType) => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await getDataApi("relational-grids?idea_type=" + ideaType)
    .then(async (response) => {
      if (response?.data?.status) {
        /** call data serialization  */
        let serilizeGrid = serilaizeGridData(response?.data?.data);
        /** send to store  */
        dispatch({
          type: CLIENT_VALUE_GRID,
          payload: serilizeGrid,
        });
      }

      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      dispatch({
        type: CLIENT_VALUE_GRID,
        payload: [],
      });
      /** procesing false */
      processing(dispatch, false);
    });
};

/**
 * delete request to server for Ideas
 *
 * @param {object} data
 *
 * @return {*}
 */
export const deleteIdea = (ideaId, data) => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await delDataApi(`ideas/${ideaId}`)
    .then(async (response) => {
      if (response?.data?.status) {
        dispatch({
          type: GET_IDEAS,
          payload: data,
        });
        success(response?.data?.message, "Success");
      } else warning(response?.data?.message, "Warning");

      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      /** error message */
      warning(error?.response?.data?.message, "Warning");
      /** procesing false */
      processing(dispatch, false);
    });
};

/**
 * delete request to server for Responsible Person
 *
 * @param {object} data
 *
 * @return {*}
 */
 export const deleteResponsiblePerson = (ownerId, data) => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await delDataApi(`responsible-persons/${ownerId}`)
    .then(async (response) => {
      if (response?.data?.status) {
        dispatch({
          type: RESPONSIBLE_PERSONS,
          payload: data,
        });
        success(response?.data?.message, "Success");
      } else warning(response?.data?.message, "Warning");

      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      /** error message */
      warning(error?.response?.data?.message, "Warning");
      /** procesing false */
      processing(dispatch, false);
    });
};


/**
 * get serialize grid data
 *
 * @param {ogject} gridData
 * @return {object}
 */
const serilaizeGridData = (gridData) => {
  let personValues = [],
    serviceValues = [],
    scoreValues = [],
    tiers = [];

  gridData?.map((options) => {
    tiers = [];

    serviceValues?.push(options?.idea_id);
    personValues[options?.idea_id] = options?.responsible_person_id;
    /** tier data serialize */
    options?.tiers?.map((option) => {
      tiers[option?.tier_id] = option?.status;
    });
    /** score value tiers */
    scoreValues[options?.idea_id] = tiers;
  });

  return {
    persons: personValues,
    scores: scoreValues,
    services: serviceValues,
  };
};

/**
 * post request to save relation grid data
 *
 * @param {object} data
 *
 * @return {*}
 */
export const saveRelationalGrid = (gridData, type) => async (dispatch) => {
  /** verify token if already set */
  // if (verifyToken()) return false;
  let gridFinalData={
    'grids': gridData,
    'type':type
  }
  
  /** processing start */
  processing(dispatch, true);

  await postDataApi("relational-grids", gridFinalData)
      .then(async response => {

          if (response?.data?.status) {

              /** show success message */
              success(response?.data?.message);
              /** fetch saved grid data */
              dispatch(getRelationalGrid(type))
          }
          /** procesing false */
          processing(dispatch, false)
      })
      .catch(error => {
        
          /** error message */
          warning(error?.response?.data?.message[0], 'Warning')
          /** procesing false */
          processing(dispatch, false)
      });
};

/**
 * loader component
 *
 * @param {function} dispatch
 * @param {boolean} action
 */
export const processing = async (dispatch, action) => {
  dispatch({
    type: LOADER,
    payload: action,
  });
  if (action) document.body.classList.add("overflow-hidden");
  else document.body.classList.remove("overflow-hidden");
};

/**
 * update gap analysis value
 *
 * @param {array} data
 * @returns
 */
export const updateGapAnalysisValue = (data) => (dispatch) => {
  dispatch({
    type: GAP_ANALYSIS_VALUE,
    payload: data,
  });
};

/**
 * alert notification component
 *
 * @param {string} title
 * @param {string} message
 */
const success = (message, title) => {
  Store.addNotification({
    title: "Success",
    message: message,
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
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
      onScreen: true,
    },
  });
};

/**
 * verify passport token
 *
 * @param {string} token
 * @return {*}
 */
const verifyToken = () => {
  return localStorage.getItem("passportToken") ? true : false;
};

export const getToken = () => {
  return verifyToken();
};

/**
 * get gap analysis heading data
 *
 * @param {*} NA
 *
 * @return {*}
 */
export const getGapAnalysisHeading = () => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await getDataApi("gap-analysis/headings")
    .then(async (response) => {
      if (response?.data?.status) {
        /** send to store  */
        dispatch({
          type: GAP_ANALYSIS_HEADING,
          payload: response?.data?.data,
        });
      }

      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      /** procesing false */
      processing(dispatch, false);
    });
};

/**
 * get gap analysis data
 *
 * @param {int} id
 *
 * @return {*}
 */
export const getGapAnalysisData = (id) => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await getDataApi("gap-analysis-scoring/" + id)
    .then(async (response) => {
      if (response?.data?.status) {
        dispatch(
          updateGapAnalysisValue(
            dispatch(serilaizeAnalysisGridData(response?.data?.data))
          )
        );
      }

      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      /** procesing false */
      processing(dispatch, false);
    });
};

/**
 * get Responsible Person for Grids
 * 
 * @param {int} id 
 * 
 * @return {*}
 */
 export const getResponsiblePersonData = () => async (dispatch) => {

    /** processing start */
    processing(dispatch, true)

    await getDataApi("responsible-persons")
        .then(async response => {

            if (response?.data?.status) {
                  /** send to store  */
                  dispatch({
                    type: RESPONSIBLE_PERSONS,
                    payload: response?.data?.data,
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
 * save gap analysis data
 *
 * @param {object} gridData
 *
 * @return {*}
 */
export const saveGapAnalysisGrid = (gridData) => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await postDataApi("gap-analysis-scoring", gridData)
    .then(async (response) => {
      if (response?.data?.status) {
        /** show success message */
        success(response?.data?.message);
      }
      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      /** error message */
      warning(error?.response?.data?.message, "Warning");
      /** procesing false */
      processing(dispatch, false);
    });
};

/**
 * get serialize analysis grid data
 *
 * @param {ogject} gridData
 * @return {object}
 */
const serilaizeAnalysisGridData = (gridData) => (dispatch) => {
  let gridDataValues = [],
    scoresValues = [],
    clientValues = [],
    clientData = [],
    data = [],
    listingId;

  gridData?.map((options) => {
    options?.gap_analysis?.map((option) => {
      data = [];
      data["gap_analysis_heading_id"] = option?.gap_analysis_heading_id;
      data["score"] = option?.score;
      data["client_id"] = option?.client_id;

      scoresValues?.push(data);
    });

    if (options?.gap_analysis && options?.gap_analysis?.length) {
      clientData = [];
      listingId = options?.listing_id;
      clientData["conversation_date"] = options?.conversation_date;
      clientData["note"] = options?.note;
      clientData["id"] = options?.id;

      clientValues?.push(clientData);
    }
  });

  gridDataValues["listing_id"] = listingId;
  gridDataValues["clients"] = clientValues;
  gridDataValues["scores"] = scoresValues;

  return gridDataValues;
};

/**
 * client tier tracker list
 *
 * @param {int) id
 *
 * @return {*}
 */
export const getTierTrackerClientList = (id) => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await getDataApi("wow-tracker/" + id)
    .then(async (response) => {
      if (response?.data?.status) {
        /** send to store  */
        dispatch({
          type: TIER_TRACKER_CLIENT,
          payload: response?.data?.data,
        });
      }

      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      /** procesing false */
      processing(dispatch, false);
    });
};

/**
 * client tier tracker list
 *
 * @param {*) NA
 *
 * @return {*}
 */
export const getTrackerIdeasList = () => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await getDataApi("wow-tracker-ideas")
    .then(async (response) => {
      if (response?.data?.status) {
        /** send to store  */
        dispatch({
          type: TRACKER_IDEAS_LIST,
          payload: response?.data?.data,
        });
      }

      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      /** procesing false */
      processing(dispatch, false);
    });
};

/**
 * client tier tracker list
 *
 * @param {*) NA
 *
 * @return {*}
 */
export const getTrackerHeading = () => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await getDataApi("wow-tracker")
    .then(async (response) => {
      if (response?.data?.status) {
        /** send to store  */
        dispatch({
          type: TRACKER_HEADING_LIST,
          payload: response?.data?.data,
        });
      }

      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      /** procesing false */
      processing(dispatch, false);
    });
};

export const saveTrackerData = (data) => (dispatch) => {
  /** save tracker grid data */
  dispatch({
    type: TRACKER_GRID_DATA,
    payload: data,
  });
};

/**
 * save gap analysis data
 *
 * @param {object} gridData
 *
 * @return {*}
 */
export const submitTrackerGridData = (id, gridData) => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await putDataApi(`wow-tracker/${id}`, gridData)
    .then(async (response) => {
      if (response?.data?.status) {
        /** show success message */
        success(response?.data?.message);
      }
      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      /** error message */
      warning(error?.response?.data?.message, "Warning");
      /** procesing false */
      processing(dispatch, false);
    });
};

/**
 * client tier tracker list
 *
 * @param {*) NA
 *
 * @return {*}
 */
export const getTrackerDataValue = (id) => async (dispatch) => {
  /** processing start */
  processing(dispatch, true);

  await getDataApi(`wow-tracker/${id}`)
    .then(async (response) => {
      if (response?.data?.status) {
        let data = response?.data?.data;
        let serializeData = serializeTrackerDataValue(data);
        /** send to store  */
        dispatch(saveTrackerData(serializeData));
      }

      /** procesing false */
      processing(dispatch, false);
    })
    .catch((error) => {
      /** procesing false */
      processing(dispatch, false);
    });
};

const serializeTrackerDataValue = (trackerData) => {
  let serializeData = [],
    clients = [],
    trackers = [];

  trackerData?.map((options) => {
    /** client info list */
    clients?.push({
      id: options?.id,
      address: options?.address,
      birthday: options?.birthday,
      aniversery: options?.aniversery,
    });
    /** idea list */
    options?.headings?.map((heading) => {
      heading?.idea?.map((idea) => {
        trackers?.push({
          idea_id: idea?.id,
          client_id: options?.id,
          tracker_id: heading?.id,
        });
      });
    });
  });
  serializeData["wow_tracker"] = trackers;
  serializeData["clients"] = clients;

  return serializeData;
};
