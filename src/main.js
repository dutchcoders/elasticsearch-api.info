import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Column, Cell} from 'fixed-data-table';
import _ from 'lodash';
import { browserHistory, Router, Route, Link } from 'react-router'
import 'whatwg-fetch';
import Select from 'react-select';

var versions = [
    { value: 'v2.0.0-beta1', label: '/v2.0.0-beta1' },
    { value: 'v2.0.0-beta2', label: '/v2.0.0-beta2' },
    { value: 'v2.0.0-rc1', label: '/v2.0.0-rc1' },
    { value: 'v2.0.0', label: '/v2.0.0' },
    { value: 'v2.0.1', label: '/v2.0.1' },
    { value: 'v2.0.2', label: '/v2.0.2' },
    { value: 'v2.1.0', label: '/v2.1.0' },
    { value: 'v2.1.1', label: '/v2.1.1' },
    { value: 'v2.1.2', label: '/v2.1.2' },
    { value: 'v2.2.0', label: '/v2.2.0' },
    { value: 'v2.2.1', label: '/v2.2.1' },
    { value: 'v2.2.2', label: '/v2.2.2' },
    { value: 'v2.3.0', label: '/v2.3.0' },
    { value: 'v2.3.1', label: '/v2.3.1' },
    { value: 'v2.3.2', label: '/v2.3.2' },
    { value: 'v2.3.3', label: '/v2.3.3' },
    { value: 'v2.3.4', label: '/v2.3.4' },
    { value: 'v5.0.0-alpha1', label: '/v5.0.0-alpha1' },
    { value: 'v5.0.0-alpha2', label: '/v5.0.0-alpha2' },
    { value: 'v5.0.0-alpha3', label: '/v5.0.0-alpha3' },
    { value: 'v5.0.0-alpha4', label: '/v5.0.0-alpha4' },
    { value: 'v5.0.0-alpha5', label: '/v5.0.0-alpha5' },
    { value: 'v5.0.0-beta1', label: '/v5.0.0-beta1' },
    { value: 'v5.0.0-rc1', label: '/v5.0.0-rc1' },
    { value: 'v5.0.0', label: '/v5.0.0' },
    { value: 'v5.0.1', label: '/v5.0.1' },
    { value: 'v5.0.2', label: '/v5.0.2' },
    { value: 'v5.1.1', label: '/v5.1.1' },
    { value: 'v5.1.2', label: '/v5.1.2' },
    { value: 'v5.2.0', label: '/v5.2.0' },
    { value: 'v5.2.1', label: '/v5.2.1' },
    { value: 'v5.2.2', label: '/v5.2.2' },
];

class Part extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        const { name, part } = this.props;
        return <div className="part"><b>{ name }</b>: {part.description}</div>
    }
}

class Param extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        const { name, param } = this.props;

        var options = null;
        if (param.options) {
            options = <span>[ {param.options.join(', ', param.options) } ]</span>;
        }      

        var default_ = null;
        if (param.default) {
            default_  = <span>( default: { param.default ? 'true':'false' } )</span>;
        }

        if (param.defaut_value) {
            default_  = <span>( default: { param.defaut_value } )</span>;
        }      

        return <div className="param"><b>{ name } (<span>{ param.type }</span>)</b>: {param.description}
                <br/>
                <span>{ param.required }</span>
                { options }
                { default_ }
            </div>;
    }
}

class Row extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        const doc = this.props.doc;

        var params = [];
        _.forEach(doc.url.params, (v, k) => {
           params.push(<Param name={k} param={v}></Param>);
        });

        var parts = [];
        _.forEach(doc.url.parts, (v, k) => {
           parts.push(<Part name={k} part={v}></Part>);
        });

        return <tr key={doc.name} className="instance">
                <td>{ doc.name }</td>
                <td>{ (() => {
                    return doc.methods.join(', ')
                })()}
                </td>
                <td>
                    { _.map(doc.url.paths, function(path) {
                                                              return <span className="path">{ path }</span>;
                                                          })
                    }
                </td>
                <td>{ parts }</td>
                <td>
                    {(() => {
                                if (doc["body"] != null) {
                                    return doc["body"]["description"];
                                }
                            })()}
                </td>
                <td>{ params }</td>
                <td>
                    <a href={ doc.documentation }>
                    [link]
                    </a>
                </td>
            </tr>       
    }
}


class RootView extends React.Component {
    constructor(props){
        super(props);

        this.state = { docs:[], error: null, path: (this.props.location.pathname || ''), q: (this.props.location.query.q || '') };

    }
    componentDidMount() {
        if (_.isUndefined(this.props.params.version)) {
            browserHistory.replace(_.assign(this.props.location, {pathname: "/v5.0.0-alpha4" }));
        } else {
            this.load(this.props.params.version);
        }
    }
    load(version) {
        this.setState({version: version});

        var $this = this;
        fetch("docs/" + version + ".json").then(function(response) {
            if (response.status !== 200) {  
                $this.setState({error: { code: response.status }});
                return;  
            }

            response.json().then(function(data) {  
                $this.setState({docs: data});
            });  
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.params.version !== nextProps.params.version) {
            this.load(nextProps.params.version);
        }
    }
    onVersionChange(v, event) {
        browserHistory.push(_.assign(this.props.location, {pathname: "/" + v.value }));
    }
    onChange(event) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        var $this = this;

        const q = event.target.value;
        this.timer = setTimeout(function() {
            if (q == '') {
                browserHistory.push(_.assign($this.props.location, {query:''}));
            } else {
                browserHistory.push(_.assign($this.props.location, {query:{ q: q}}));
            }
        }, 200);

        this.setState({q: q});
    }
    render() {
        const q = this.props.location.query.q;

        var docs = _.filter(this.state.docs, function(doc) {
            var re = new RegExp(q, 'gi');
            return doc.name.match(re) || doc.url.path.match(re);
        });

        if (this.state.error != null) {
            return <div>{this.state.error.code}</div>
        }

        return <div>
                <div className="row">
                <form className="form-inline ">
                    <div className="input-group col-lg-9">
                          <input placeholder="type to filter" className="form-control" onChange={this.onChange.bind(this)} value={ this.state.q }/>
                    </div>
                    <div className="input-group col-lg-offset-1 col-lg-2">
                    <Select
                        name="form-field-name"
                        value={this.state.version}
                        options={versions}
                        onChange={this.onVersionChange.bind(this)}
                    />
                    </div>
                </form>
                </div>
                <div className="row">
                <div className="table-responsive">
                <table className="table table-bordered table-hover table-condensed table-striped">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Methods</th>
                            <th>Paths</th>
                            <th>Parts</th>
                            <th>Description</th>
                            <th>Params</th>
                            <th>Documentation</th>
                        </tr>
                    </thead>
                    <tbody>
                      { _.map(docs, (doc) => 
                        <Row key={doc.name} doc={doc} />
                      )
                    }
                    </tbody>
                </table>
            </div>
            </div>
            </div>
    }
}

ReactDOM.render((
  <Router 
    history={browserHistory} 
    onUpdate={() => { if (_.isUndefined(window.ga)) return; window.ga('send', 'pageview', location.pathname + location.search ); }}>
      <Route path='/:version' component={RootView} />
      <Route path='/' component={RootView} />
  </Router>
), document.getElementById('app'))




