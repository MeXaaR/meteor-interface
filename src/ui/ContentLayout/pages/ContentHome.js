import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import slugify from 'slugify';
import { Transition, Spring } from 'react-spring'

// Packages
import { 
    Segment,
    Header,
    Statistic,
    Icon,
    Grid
} from 'semantic-ui-react';
import styled from 'styled-components';

// Components
import LoadingComponent from '../../components/LoadingComponent'

const ContentHome = ({ counters = [], history, ready, config }) => {
    // Extract datas from config
    const { 
        root = '/admin',
        collections = [],
    } = config
    
    return (
    <ContentHomeStyle>
            <Spring from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
            { styles => 
                <Segment style={styles}>
                    <Header content="Dashboard" as="h5" />     
                </Segment> }
            </Spring>
                { counters.length !== 0 ?
                    <Grid stackable>
                    <Transition
                        keys={counters.map(count => count.name)}
                        from={{ marginTop: 1000 }}
                        enter={{ marginTop: 0 }}
                        leave={{ marginTop: 1000 }}>
                        {
                            counters.map(count => styless =>
                                <Grid.Column 
                                    width={8} 
                                    key={count.name}  
                                    style={styless}
                                    onClick={() => history.push(`${root}/collections/${slugify(count.name, { lower: true })}`)} 
                                >
                                    <Segment className="single-vignette" color="green">
                                    { count.icon && <Icon color="grey" size="huge" name={count.icon} />}
                                        <Statistic size='small'>
                                            <Statistic.Value>
                                                {count.number}
                                            </Statistic.Value>
                                            <Statistic.Label>{count.name}</Statistic.Label>
                                        </Statistic>
                                    </Segment>
                                </Grid.Column>
                            )
                        }
                    </Transition>
                </Grid> 
                : null }
    </ContentHomeStyle>
)}


export default withTracker(({ config }) => {
    const subscription = Meteor.subscribe('interface.counters.all.collections')
    const ready = subscription.ready()
    const counters = []

    // Extract datas from config
    const { collections = [] } = config

    collections.map(coll => {
        if(Roles.userIsInRole(Meteor.userId(), coll.visible)){
            counters.push({
                name: coll.label,
                icon: coll.icon,
                number: Counts.get(`count-all-${slugify(coll.label, { lower: true })}`)
            })
        }
    })
    
    return { counters, ready };
  })(ContentHome);

const ContentHomeStyle = styled.div`
  h5.header {
      letter-spacing:2px;
  }
  .single-vignette {
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: box-shadow 0.2s ease-in;
    cursor: pointer;
    .ui.statistic {
        margin-top: 0;
        .value{
            color: #21ba45 !important;
        }
    }
    &:hover {
        box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.75);
    }
  }
`