import React, { Fragment, useEffect, useState } from "react";
import GlobalStyle from "./styles/global";
import { BoxList, Container, Content } from "./styles/app";
import Upload from './components/Upload';
import FileListItem from './components/FileList';
import { uniqueId } from 'lodash';
import filesize from 'filesize';
import api from './services/api';

interface AttrFiles {
    file: File;
    id: number;
    name: string;
    readableSize: string;
    preview: string;
    progress: number;
    uploaded: boolean;
    error: boolean;
    url: string;
}

const App: React.FC = () => {

    const [uploadedFiles, setUploadedFiles] = useState<AttrFiles[]>([]);
    const [startUpload, setStartUpload] = useState(false);

    useEffect(() => {
        if(startUpload) {
            uploadedFiles.forEach(upload => {
                if(upload.progress === 0) {
                    processUpload(upload)
                }
            })
            setStartUpload(false)
        }
    },[startUpload])

    const handleUpload = (files:any) => {

        const uploaded:AttrFiles[] = files.map((file:any) => ({
            file,
            id: uniqueId(),
            name: file.name,
            readableSize: filesize(file.size),
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            error: false,
            url: null
        }))
        const oldStateFiles = [...uploadedFiles, ...uploaded];
        setUploadedFiles(oldStateFiles);
        setStartUpload(true)
    }

    const processUpload = (uploadFile:any) => {
        const data = new FormData();
        data.append('file', uploadFile.file, uploadFile.name);
        api.post('posts', data, {
            onUploadProgress: e => {
                const calc = Math.round((e.loaded * 100) / e.total);

                setUploadedFiles(prevState => {

                    return prevState.map(item => {
                        if (item.id === uploadFile.id) {
                            item.progress = calc
                        }
                        return item
                    })
                })
            }
        }).then(response => {
            setUploadedFiles(prevState => {
                return prevState.map(item => {
                    if (item.id === uploadFile.id) {
                        item.uploaded= true;
                        item.id = response.data._id;
                        item.url = response.data.url;
                    }
                    return item
                })
            })
        }).catch(() => {
            setUploadedFiles(prevState => {
                return prevState.map(item => {
                    if (item.id === uploadFile.id) {
                        item.error = true;
                    }
                    return item
                })
            })
        });
    }

    const handleDelete = async (id:number) => {
        await api.delete(`posts/${id}`);
        setUploadedFiles(prevState => {
            return prevState.filter(item => item.id !== id);
        })
    }

    return (
        <Fragment>
            <Container>
                <Content>
                    <Upload onUpload={handleUpload} />
                        {
                            !!uploadedFiles.length && (
                                <BoxList>
                                    {
                                        uploadedFiles.map((itemFile:AttrFiles) => (
                                            <FileListItem {...itemFile } key={itemFile.id} />
                                        ))
                                    }
                                </BoxList>
                            )
                        }
                </Content>
            <GlobalStyle />
            </Container>
        </Fragment>
    );
}

export default App;
