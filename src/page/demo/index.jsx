import React, { Component } from 'react'
import { Button, Input, Tag, Table, Modal } from 'antd';
import axios from 'axios';
import './index.less'
const { Search } = Input

const descriptionContent = text => <span className='description-cel' title={text}>{text}</span>
const urlcontent = text => <span className='description-cel' title={text}><a href={text}>{text}</a></span>
const tagsContent = tags => (
    <>
        {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
                color = 'volcano';
            }
            return (
                <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                </Tag>
            );
        })}
    </>
)
const imageContent = imgUrl => <img src={imgUrl} alt="" />
const baseUrlContent = baseUrl => <a href={baseUrl}>链接</a>


export default class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            data: null,
            visible: false,
            propertiesData: null,
        }
    }
    componentDidMount() {
        this.getJsonData()
    }
    getJsonData = () => {
        axios.post('http://www.mocky.io/v2/5ea28891310000358f1ef182')   //平时做项目时间充足会单独封装一个axios
            .then((res) => {
                this.setState(({
                    data: res.data.apis,
                    dataSource: res.data.apis
                }))
            })
    }
    screening = (e) => {
        let newData = JSON.parse(JSON.stringify(this.state.data))
        let new_arr = []
        newData.map(ele => {
            ele.tags.map(item => {
                if (item.indexOf(e.target.value) != -1) {
                    new_arr.push(ele)
                }
            })
        })
        this.setState({
            dataSource: new_arr
        })
    }
    onCancel = () => {
        this.setState({
            visible: false
        })
    }
    render() {
        const columns = [
            {
                title: 'name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'description',
                dataIndex: 'description',
                key: 'description',
                window: '300px',
                render: text => descriptionContent(text)
            },
            {
                title: 'image',
                dataIndex: 'image',
                key: 'image',
                render: imgUrl => imageContent(imgUrl)
            },
            {
                title: 'baseURL',
                dataIndex: 'baseURL',
                key: 'baseURL',
                render: baseUrl => baseUrlContent(baseUrl)
            },
            {
                title: 'tags',
                dataIndex: 'tags',
                key: 'tags',
                render: tags => tagsContent(tags)
            },
            {
                title: 'properties',
                dataIndex: 'properties',
                key: 'properties',
                render: properties => {
                    return <Button
                        onClick={() => {
                            this.setState({
                                visible: true,
                                propertiesData: properties
                            })
                        }}
                    >属性</Button>
                }

            }
        ]
        const propertiesColumns = [
            {
                title: 'type',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: 'url',
                dataIndex: 'url',
                key: 'url',
                render: url => urlcontent(url)
            },
        ]
        let {
            dataSource,
            data,
            visible,
            propertiesData
        } = this.state
        let {
            screening,
            onCancel

        } = this
        return (
            <div className='demo-page'>
                <header>
                    <Search
                        placeholder="请输入名称"
                        onChange={(e) => screening(e)}
                    >

                    </Search>
                </header>
                <main>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={(record, idx) => idx}
                        loading={!data}
                    >

                    </Table>
                </main>
                <Modal
                    width="650px"
                    title='属性'
                    onCancel={onCancel}
                    visible={visible}
                    footer={
                        <Button danger onClick={() => onCancel()}>关闭</Button>
                    }
                >
                    <Table
                        columns={propertiesColumns}
                        dataSource={propertiesData}
                        rowKey={(record, idx) => idx}
                        loading={!propertiesData}
                    >
                    </Table>
                </Modal>
            </div>
        )
    }
}
