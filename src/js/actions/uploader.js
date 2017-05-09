 <Uploader
                                title="Image Uploader"
                                maxCount={6}
                                files={this.state.demoFiles}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                    let newFiles = [...this.state.demoFiles, {url:file.data}];
                                    this.setState({
                                        demoFiles: newFiles
                                    });
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file, i)
                                        this.setState({
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                                lang={{
                                    maxError: maxCount => `Max ${maxCount} images allow`
                                }}
                            />