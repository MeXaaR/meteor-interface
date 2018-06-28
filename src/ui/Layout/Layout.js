import React, { Component }     from "react"

// Packages
import { Helmet }               from "react-helmet";
import { Switch, Route }        from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import styled                   from 'styled-components';


// Components
import DynamicImporter          from "../../utils/DynamicImporter";
import ConditionnalRoute        from "../../utils/ConditionnalRoute";
import MainMenu                 from './components/MainMenu'
import UnderDev                 from '../components/UnderDev'

// Global Config
import '../../styles'

// Pages
const ContentLayout = DynamicImporter(() => import('../ContentLayout/ContentLayout'))
const SettingsLayout = DynamicImporter(() => import('../SettingsLayout/SettingsLayout'))
const MediaManager = DynamicImporter(() => import('../MediaManager/MediaManager'))
const ProfileLayout = DynamicImporter(() => import('../Profile/ProfileLayout'))
const Home = DynamicImporter(() => import('./components/Home'))

class AdminLayout extends Component{
  state = {

  }

componentWillReceiveProps = (nextProps) => {
    const { location } = this.props;
    if(location.pathname !== nextProps.location.pathname){
      window.scrollTo(0,0)
    }
  }

  componentDidCatch = (error) => {
    console.log(error)
    this.setState({ error })
  }

  render() {
    const { user, permissions, loggingIn, authenticated, authorized, config = {}, root } = this.props;
    const { error } = this.state;
    if(error){
        return (
            <div>{JSON.stringify(error)}</div>
        )
    }
    return (
      <AdminLayoutStyle id="admin-layout">
        <MainMenu {...this.props} />
          <Switch>

            <ConditionnalRoute
                exact
                path={`${root}`}
                Element={Home}  
                computedProps={{ user, permissions, loggingIn, authenticated, authorized, root, config }}  
            />

            <ConditionnalRoute
                path={`${root}/collections`}
                Element={ContentLayout}  
                computedProps={{ user, permissions, loggingIn, authenticated, authorized, root, config }}  
            />

            <ConditionnalRoute
                path={`${root}/media`}
                Element={MediaManager}  
                computedProps={{ user, permissions, loggingIn, authenticated, authorized, root, config }}  
            />

            <ConditionnalRoute
                path={`${root}/profile`}
                Element={ProfileLayout}  
                computedProps={{ user, permissions, loggingIn, authenticated, authorized, root, config }}  
            />

            <ConditionnalRoute
                path={`${root}/settings`}
                condition={permissions[config.roles[0]]} 
                Element={SettingsLayout}  
                redirect={root} 	   
                computedProps={{ user, permissions, loggingIn, authenticated, authorized, root, config }}  
            />

          </Switch>
          <ToastContainer />
      </AdminLayoutStyle>
    )
  }
}

export default AdminLayout;

const AdminLayoutStyle = styled.main`
  padding-top: 70px;
  .ui.form .field {
    label {
        background-color: #21ba45;
        color: white !important;
        width: fit-content;
        padding-left: 3px;
        padding-right: 3px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        margin-bottom: 0px !important;
    }
    .ui.input {
        background-color: #fff;
        border: 2px solid #21ba45;
        border-radius: 5px;
        border-top-left-radius: 0;
        box-shadow: none;
        color: #444a57;
        display: block;
        font-size: 15px;
        line-height: 1.5;
        margin: 0;
        outline: 0;
        position: relative;
        transition: border-color .2s ease;
        width: 100%;
        > * {
            border: none !important;
            width: calc(100% - 4px) !important;
            margin: 2px;
        }
    }
    .ui.dropdown, textarea {
        border: 2px solid #21ba45;
        border-radius: 5px;
        border-top-left-radius: 0;
        box-shadow: none;
        color: #444a57;
        font-size: 15px;
        line-height: 1.5;
        margin: 0;
        outline: 0;
        transition: border-color .2s ease;
        width: 100%;
    }
    .ui.fitted.toggle.checkbox, .wrapper {
        padding: 8px;
        width: 100%;
        border: 2px solid #21ba45;
        border-radius: 5px;
        border-top-left-radius: 0;
        >label {
            background-color: transparent !important;
        }
    }
    .ui.fitted.toggle.checkbox {
        background-color: #21ba45;
    }
    span.react-datetime-picker__button__input__divider {
        margin-right: 5px;
    }

    input.react-datetime-picker__button__input__input.react-datetime-picker__button__input__minute.react-datetime-picker__button__input__input--hasLeadingZero {
        margin-left: -9px;
        background-color: transparent;
    }

    .datepicker {

        padding: 8px;
        width: 100%;
        border-top-left-radius: 0 !important;
        border: 2px solid #21ba45;
        border-radius: 5px;

        >div {
            border: none;
        }
        input {
            padding: 0 !important;
            border: none !important;
            color: #444a57;
            font-size: 15px;
            text-align: center;
            width: auto !important;
        }
        >div:nth-child(2) {
            position: fixed;
            top: 0px !important;
            left: 0px !important;
            right: 0px !important;
            bottom: 0px !important;
            background: rgba(0,0,0,0.4);
            z-index: 4;
            width: 100vW;
        }
        .react-datetime-picker__clock {
            display: none !important;
        }
    }
    .calendar {
        margin-bottom: 20px;
        position: fixed;
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        left: 50%;
    }
    .clock {
        display: none;
    }
}
`