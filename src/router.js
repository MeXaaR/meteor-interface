import React     from "react"

// Packages
import { Switch }        from "react-router-dom";
import { Helmet }               from 'react-helmet';
import { ToastContainer } from 'react-toastify';

// Utils
import DynamicImporter          from "./utils/DynamicImporter";
import ConditionnalRoute        from "./utils/ConditionnalRoute";
import LoadingComponent         from "./ui/components/LoadingComponent"
import notifierInit             from "./utils/notifier";

// Context
import UserProvider, { UserContext } from './utils/contexts/UserProvider'

// Pages
const AdminLayout = DynamicImporter(() => import('./ui/Layout/Layout'))
const Login = DynamicImporter(() => import('./ui/Login/Login'))
const UploaderNotifier = DynamicImporter(() => import('./ui/components/Uploader/UploaderNotifier'))


const GlobalRouter = () => {

    if(Meteor.isServer){
        return (<LoadingComponent />);
    } 
    

    return (
        <UserProvider>
        <UserContext.Consumer>
        {({ user, permissions, loggingIn, authenticated, authorized, config = {} }) => {

            const { root, title, login } = config
            notifierInit(config)
            return (
                <React.Fragment>
                <Helmet>
                    <title>{title}</title>
                    <meta name="robots" content="noindex, nofollow"/>
                    <meta name="author" content="MeXaR"/>
                    <link rel="icon" type="image/png" href="https://goo.gl/WQahB9"/>
                    
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
                    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"/>
                    <link href="https://fonts.googleapis.com/css?family=Lato|Oswald|Titillium+Web:200,300,400,400i,600,700,900" rel="stylesheet"/>
                    <script async defer src="//cdn.tinymce.com/4/tinymce.min.js"></script>
        
                </Helmet>
                    <Switch>
                        <ConditionnalRoute
                            exact
                            path={`${root}${login}`}
                            waitWhile={loggingIn}  
                            condition={!authenticated} 
                            Element={Login}  
                            redirect={root} 	   
                            computedProps={{ root, user, permissions, loggingIn, authenticated, config }}  
                        />
                        <ConditionnalRoute
                            path={root}
                            waitWhile={loggingIn}  
                            condition={authorized}  
                            Element={AdminLayout}
                            redirect={`${root}${login}`}   
                            computedProps={{ root, user, permissions, loggingIn, authenticated, authorized, config }}  
                        />
                    </Switch>
                    <UploaderNotifier />
                    <ToastContainer />
                </React.Fragment>
                )
        }
        }
        </UserContext.Consumer>
        </UserProvider>
    )
}

// export default () => <Route path={root} component={GlobalRouter} /> 
export default GlobalRouter
