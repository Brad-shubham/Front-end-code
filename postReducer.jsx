import {
    LOADER,
    GET_GLOBAL_METRIC,
    STATEMENT_LISTING,
    SELECTED_LISTING,
    GET_TIERS,
    RESPONSIBLE_PERSONS,
    SAVE_TOKEN,
    SAVE_REQUIRED,
    FILTER_LISTING,
    SELECTED_AREA,
    CLIENT_METRIC_DATA,
    CLIENT_HEADING,
    ACTIVE_METRIC,
    ACTIVE_METRIC_VALUE,
    CLIENT_DEMO_POINTS,
    CLIENT_PSYCHO_POINTS,
    CLIENT_TOTAL_POINTS,
    CLIENT_SCORES,
    CET_CLIENTS,
    GET_IDEAS,
    CLIENT_VALUE_GRID,
    GAP_ANALYSIS_HEADING,
    GAP_ANALYSIS_VALUE,
    TIER_TRACKER_CLIENT,
    TRACKER_IDEAS_LIST,
    TRACKER_HEADING_LIST,
    TRACKER_GRID_DATA,
    TRACKER_GRID_DATA_VALUES,
    USER_PROFILE,
    EMPTY_REDUX_DATA
} from "./../actions/types";
  
import jwtDecode from 'jwt-decode';

  /** common helper instance */
  import Helper from "./../../components/helper";
  
  /** constants instance */
  import { constants } from "./../../components/constants";
  
  /** helper class */
  let helper = new Helper();
  
    /** reduceer initial storage */
    const initialState = {
        authUser: JSON.parse(localStorage.getItem('authUser')) ? JSON.parse(localStorage.getItem('authUser')) : false,
        passportToken: localStorage.getItem('passportToken'),
        constants: constants,
        helper: helper,
        processing: false,
        actionRequired: false,
        globalMetrics: [],
        statementListing: [],
        selectedListing: JSON.parse(localStorage.getItem('statementListingData')) || false,
        tiersList: [],
        currentListingData: [],
        selectedAreaItems: [],
        clientMetricData: [],
        metricHeading: [],
        activeDemoMetric: false,
        activeMetricValues: [],
        clientDemoPoints: [],
        clientPsychoPoints: [],
        clientTotalPoints: [],
        clientScores: [],
        clients: [],
        ideaList: [],
        valueGrid: [],
        gapAnalysisHeading: [],
        gapAnalysisValue: [],
        tierTrackerClients: [],
        trackerIdeasList: [],
        trackerHeadingList: [],
        trackerGridData: [],
        trackerGridDataValues: [],
        userProfile:'',
        responsiblePersons: []
    };
  
    export default function (state = initialState, actions) {
        switch (actions.type) {
            
            case USER_PROFILE:{
                return {
                    ...state,
                    userProfile: actions.payload,
                }
            }

            case TRACKER_GRID_DATA_VALUES:{
                return {
                    ...state,
                    trackerGridDataValues: actions.payload,
                }
            }

            case TRACKER_GRID_DATA:{
                return {
                    ...state,
                    trackerGridData: actions.payload,
                }
            }

            case TRACKER_HEADING_LIST:{
                return {
                    ...state,
                    trackerHeadingList: actions.payload,
                }
            }

            case TRACKER_IDEAS_LIST:{
                return {
                    ...state,
                    trackerIdeasList: actions.payload,
                }
            }

            case TIER_TRACKER_CLIENT:{
                return {
                    ...state,
                    tierTrackerClients: actions.payload,
                }
            }

            case GAP_ANALYSIS_VALUE:{
                return {
                    ...state,
                    gapAnalysisValue: actions.payload,
                }
            }

            case GAP_ANALYSIS_HEADING:{
                return {
                    ...state,
                    gapAnalysisHeading: actions.payload,
                }
            }

            case CLIENT_VALUE_GRID:{
                return {
                    ...state,
                    valueGrid: actions.payload,
                }
            }

            case GET_IDEAS:{
                return {
                    ...state,
                    ideaList: actions.payload,
                }
            }

            case CET_CLIENTS:{
                return {
                    ...state,
                    clients: actions.payload,
                }
            }
            case CLIENT_DEMO_POINTS :{
                return {
                    ...state,
                    clientDemoPoints: actions.payload,
                }
            }

            case CLIENT_SCORES :{
                return {
                    ...state,
                    clientPsychoPoints: actions.payload,
                }
            }

            case CLIENT_PSYCHO_POINTS :{
                return {
                    ...state,
                    clientPsychoPoints: actions.payload,
                }
            }

            case CLIENT_TOTAL_POINTS :{
                return {
                    ...state,
                    clientTotalPoints: actions.payload,
                    clientPsychoPoints: actions.payload,
                }
            }

            case ACTIVE_METRIC :{
                return {
                    ...state,
                    activeDemoMetric: actions.payload,
                }
            }
            case ACTIVE_METRIC_VALUE:{
                return {
                    ...state,
                    activeMetricValues: actions.payload,
                }
            }

            case LOADER: {
                return {
                    ...state,
                    processing: actions.payload,
                }
            }

            case GET_GLOBAL_METRIC: {
                return {
                    ...state,
                    globalMetrics: actions.payload,
                }
            }
            case STATEMENT_LISTING: {
                return {
                    ...state,
                    statementListing: actions.payload
                }
            }
            case SELECTED_LISTING: {
                return {
                    ...state,
                    selectedListing: actions.payload
                }
            }
            case GET_TIERS: {
                return {
                    ...state,
                    tiersList: actions.payload
                }
            }
            case SAVE_TOKEN: {
                return {
                    ...state,
                    authUser: actions.payload,
                    processing: false,
                    passportToken: actions?.payload?.token
                }
            }
            case SAVE_REQUIRED: {
                return {
                    ...state,
                    actionRequired: actions.payload
                }
            }
            case FILTER_LISTING: {
                return {
                    ...state,
                    currentListingData: actions.payload
                }
            }
            case SELECTED_AREA: {
                return {
                    ...state,
                    selectedAreaItems: actions.payload
                }
            }
            case CLIENT_METRIC_DATA: {
                return {
                    ...state,
                    clientMetricData: actions.payload
                }
            }
            case CLIENT_HEADING: {
                return {
                    ...state,
                    metricHeading: actions.payload
                }
            }
            case RESPONSIBLE_PERSONS: {
                return {
                    ...state,
                    responsiblePersons: actions.payload
                }
            }
            case EMPTY_REDUX_DATA: {
                return{
                    ...state,
                    authUser: null,
                    passportToken: null,
                    constants: constants,
                    helper: helper,
                    processing: false,
                    actionRequired: false,
                    globalMetrics: [],
                    statementListing: [],
                    selectedListing: null || false,
                    tiersList: [],
                    currentListingData: [],
                    selectedAreaItems: [],
                    clientMetricData: [],
                    metricHeading: [],
                    activeDemoMetric: false,
                    activeMetricValues: [],
                    clientDemoPoints: [],
                    clientPsychoPoints: [],
                    clientTotalPoints: [],
                    clientScores: [],
                    clients: [],
                    ideaList: [],
                    valueGrid: [],
                    gapAnalysisHeading: [],
                    gapAnalysisValue: [],
                    tierTrackerClients: [],
                    trackerIdeasList: [],
                    trackerHeadingList: [],
                    trackerGridData: [],
                    trackerGridDataValues: [],
                    userProfile:'',
                    responsiblePersons: []
                }
            }
            /** default action */
            default:
                return { ...state };
        }
    }
    