import React,{Component} from 'react'
//default page
import DfHeader from '../../components/Layout/Default/Header'
import DfFooter from '../../components/Layout/Default/Footer'
// not found page
import NotFoundHeader from '../../components/Layout/NotFound/Header'
import NotFoundFooter from '../../components/Layout/NotFound/Footer'

const layout = (ChildComponent, page = "default") =>
    class Layout extends Component {
        render() {
            const { ...rest } = this.props
            return (
                <>
                    {/* for default pages*/}
                    {
                        (page === 'default') ?
                        <>
                            <DfHeader/>
                            <ChildComponent
                                {...rest}
                            />
                            <DfFooter />
                        </> : null
                    }
                    {/* for admin page*/}
                    {
                        (page === 'admin') ?
                        <>
                            <h1>admin</h1>
                            <ChildComponent
                                {...rest}
                            />
                            <h1>admin</h1>
                        </> : null
                    }
                    {/* for 404 page*/}
                    {
                        (page === 'not-found') ?
                            <>
                                <NotFoundHeader/>
                                <ChildComponent
                                    {...rest}
                                />
                                <NotFoundFooter />
                            </> : null
                    }
                </>
            )
        }
    }

export default layout