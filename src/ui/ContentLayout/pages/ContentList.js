import React, { Component } from 'react';
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
    Dropdown,
    Checkbox,
} from 'semantic-ui-react';
import styled from 'styled-components';
import ConfirmationButton from '../../components/ConfirmationButton';

class ContentList extends Component {
    state = {
        selected: []
    }

    updateSearch = (e, { value }) => {
        const { params = {} } = this.props;
        const currentParams = params.get();
        currentParams.search = value;
        currentParams.page = 1;
        params.set(currentParams);
    }

    selectItem = (e, { name }) => {
        const { selected = [] } = this.state;
        const itemIndex = selected.indexOf(name)
        if (itemIndex > -1) {
            selected.splice(itemIndex, 1)
        } else {
            selected.push(name)
        }
        this.setState({ selected })
    }

    deleteItems = () => {
        const { collection } = this.props;
        const { selected = [] } = this.state;
        const method = `interface.delete.${slugify(collection.label, { lower: true })}`;
        this.setState({ loading: true });
        const self = this;
        Meteor.call(method, { itemIds: selected }, function (error, result) {
            if (result) {
                self.setState({ loading: false, selected: [], duplicateConfirm: false, deleteConfirm: false })
                notify.success('Documents deleted')
            } else if (error) {
                self.setState({ loading: false, duplicateConfirm: false, deleteConfirm: false })
                notify.error(error.reason)
            }
        })
    }

    duplicateItems = () => {
        const { collection } = this.props;
        const { selected = [] } = this.state;
        const method = `interface.duplicate.${slugify(collection.label, { lower: true })}`;
        this.setState({ loading: true });
        const self = this;
        Meteor.call(method, { itemIds: selected }, function (error, result) {
            if (result) {
                self.setState({ loading: false, selected: [], duplicateConfirm: false, deleteConfirm: false })
                notify.success('Documents duplicated')
            } else if (error) {
                self.setState({ loading: false, duplicateConfirm: false, deleteConfirm: false })
                notify.error(error.reason)
            }
        })
    }

    toggleChoice = (e, { name }) => this.setState({ [name]: !this.state[name] })

    cancel = () => this.setState({ duplicateConfirm: false, deleteConfirm: false })

    render() {
        const { history, collection = {}, list = [], firstField, params = {}, number, root, config } = this.props
        const { selected = [], duplicateConfirm, deleteConfirm, loading } = this.state;


        const creatable = Roles.userIsInRole(Meteor.userId(), collection.create)
        const currentParams = params.get()
        return (
            <ContentListStyle>
                <Spring native from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
                    {styles =>
                        <animated.div style={styles} >
                            <Segment style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Header style={{ marginBottom: 0 }} icon={collection.icon} content={collection.label} as="h5" />
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {(deleteConfirm || duplicateConfirm) &&
                                        <Spring native from={{ opacity: 0 }} to={{ opacity: 1 }}>
                                            {styles =>
                                                <animated.div style={styles}>
                                                    <ConfirmationButton
                                                        dialog={deleteConfirm ?
                                                            ["Delete", "Are You Sure?", "Once more to delete"]
                                                            :
                                                            ["Duplicate", "Are You Sure?"]
                                                        }
                                                        loading={loading}
                                                        times={deleteConfirm ? 3 : 2}
                                                        action={deleteConfirm ? this.deleteItems : this.duplicateItems}
                                                        colors={deleteConfirm ? null : ['teal', 'teal']}
                                                        onCancel={this.cancel}
                                                        started={true}
                                                        type={deleteConfirm ? "trash" : "copy"}
                                                    />
                                                </animated.div>
                                            }
                                        </Spring>}
                                    {creatable && selected.length > 0 && !deleteConfirm && !duplicateConfirm &&
                                        <Spring native from={{ opacity: 0 }} to={{ opacity: 1 }}>
                                            {styles =>
                                                <animated.div style={styles}>
                                                    <Dropdown text='ACTIONS' icon='cogs' floating labeled button className='mini teal icon'>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item content="Delete" icon="trash" onClick={this.toggleChoice} name="deleteConfirm" />
                                                            <Dropdown.Item content="Duplicate" icon="copy" onClick={this.toggleChoice} name="duplicateConfirm" />

                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </animated.div>
                                            }
                                        </Spring>}
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
                                </div>
                            </Segment>
                        </animated.div>}
                </Spring>
                <Spring native from={{ opacity: 0, marginLeft: 600 }} to={{ opacity: 1, marginLeft: 0 }}>
                    {styles =>
                        <animated.div style={styles} >
                            <Input
                                placeholder="Search..."
                                style={{ marginBottom: 10, marginTop: 10, borderRadius: 5, boxShadow: "1px 1px 2px 0px rgba(0,0,0, 0.3)" }}
                                onChange={this.updateSearch}
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
                                selectItem={this.selectItem}
                                selected={selected}
                            />
                        </animated.div>}
                </Spring>
            </ContentListStyle>
        )
    }
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

const ListInTable = ({ history, collection = {}, list = [], firstField, style, params, number, root, config, selected, selectItem }) => {
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

    // const deleteItem = (itemId) => {
    //     const method = `interface.delete.${slugify(collection.label, { lower: true })}`;
    //     Meteor.call(method, { itemId }, function (error, result) {
    //         self.setState({ loading: false })
    //         if (result) {
    //             notify.success('Document deleted')
    //         } else if (error) {
    //             notify.error(error.reason)
    //         }
    //     })
    // }

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
                            <Header as='h5' style={{ display: "flex", alignItems: "center" }} image={imageField ? true : false}>
                                <Checkbox
                                    style={{ marginRight: 8 }}
                                    checked={selected.indexOf(item._id) > -1}
                                    onChange={selectItem}
                                    name={item._id}
                                />
                                {imageField ? <Image src={item[imageField]} rounded size='mini' /> : null}
                                <Header.Content>
                                    {item[firstField] || item.name || item.title || item.username}
                                    {item.createdAt ? <Header.Subheader>{moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Header.Subheader> : null}
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell collapsing>
                            {/*editable &&
                                <ConfirmationButton
                                    dialog={["Delete", "Delete", "Delete"]}
                                    action={() => deleteItem(item._id)}
                                    type='trash'
                            />*/}
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