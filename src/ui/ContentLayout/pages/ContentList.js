import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import { Transition, Spring, animated } from 'react-spring'
import moment from 'moment'

// Packages
import {
    Segment,
    Header,
    Input,
    Table,
    Image,
    Pagination,
    Button,
} from 'semantic-ui-react';
import styled from 'styled-components';

const ContentList = ({ history, ready, collection = {}, list = [], firstField, params = {}, number, root, config }) => {

    const creatable = Roles.userIsInRole(Meteor.userId(), collection.create)
    const currentParams = params.get()

    const updateSearch = (e, { value }) => {
        currentParams.search = value;
        currentParams.page = 1;
        params.set(currentParams)
    }

    return (
        <ContentListStyle>
            <Spring native from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
                {styles =>
                    <animated.div style={styles} >
                        <Segment style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Header style={{ marginBottom: 0 }} icon={collection.icon} content={collection.label} as="h5" />
                            {creatable &&
                                <Link to={`${root}/collections/${slugify(collection.label, { lower: true })}/new`}>
                                    <Button
                                        content="NEW"
                                        size="mini"
                                        icon="magic"
                                        color="green"
                                        labelPosition="left"
                                    />
                                </Link>}
                        </Segment>
                    </animated.div>}
            </Spring>
            <Spring native from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
                {styles =>
                    <animated.div style={styles} >
                        <Input
                            placeholder="Search..."
                            style={{ marginBottom: 10, marginTop: 10, borderRadius: 5, boxShadow: "1px 1px 2px 0px rgba(0,0,0, 0.3)" }}
                            onChange={updateSearch}
                            fluid
                            value={currentParams.search}
                        />
                    </animated.div>}
            </Spring>
            <Spring native from={{ opacity: 0, marginTop: 600 }} to={{ opacity: 1, marginTop: 0 }}>
                {styles2 =>
                    <animated.div style={styles2} >
                        <ListInTable
                            list={list}
                            history={history}
                            collection={collection}
                            firstField={firstField}
                            params={params}
                            number={number}
                            root={root}
                            config={config}
                        />
                    </animated.div>}
            </Spring>
        </ContentListStyle>
    )
}

export default ContentList

const ContentListStyle = styled.div`
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
            color: #21ba45!important;
        }
    }
    &:hover {
        box-shadow: 5px 5px 9px 0px rgba(0,0,0,0.75);
    }
  }
`

const ListInTable = ({ history, collection = {}, list = [], firstField, style, params, number, root, config }) => {
    let imageField = null
    collection.fields.map(field => {
        if (field.widget === 'image') {
            imageField = field.name
        }
    })
    const totalPages = Math.ceil(number / 10)
    const currentParams = params.get()

    const editable = Roles.userIsInRole(Meteor.userId(), collection.edit)

    const handlePaginationChange = (e, { activePage }) => {
        currentParams.page = activePage;
        params.set(currentParams)
    }

    return (
        <Table size='small' celled selectable style={style} color="green">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Items</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {list.map(item =>
                    <Table.Row key={item._id} >
                        <Table.Cell>
                            <Header as='h5' image={imageField ? true : false}>
                                {imageField ? <Image src={item[imageField]} rounded size='mini' /> : null}
                                <Header.Content>
                                    {item[firstField] || item.name || item.title || item.username}
                                    {item.createdAt ? <Header.Subheader>{moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Header.Subheader> : null}
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell collapsing>
                            {editable &&
                                <Button
                                    onClick={() => history.push(`${root}/collections/${slugify(collection.label, { lower: true })}/${item._id}/edit`)}
                                    content="EDIT"
                                    size="mini"
                                    icon="edit"
                                    color="blue"
                                    labelPosition="left"
                                />}
                            <Button
                                onClick={() => history.push(`${root}/collections/${slugify(collection.label, { lower: true })}/${item._id}`)}
                                content="VIEW"
                                size="mini"
                                icon="eye"
                                color="green"
                                labelPosition="left"
                            />
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
            <Table.Footer >
                <Table.Row>
                    <Table.HeaderCell colSpan="2">
                        <Pagination
                            activePage={currentParams.page}
                            onPageChange={handlePaginationChange}
                            totalPages={totalPages}
                            size='small'
                            color='green'
                        />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    )
}