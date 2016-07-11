import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Column, Cell} from 'fixed-data-table';
import _ from 'lodash';
import { browserHistory, Router, Route, Link } from 'react-router'
import 'whatwg-fetch';

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

        this.state = { docs:[], error: null, q: (this.props.location.query.q || '') };

    }
    load() {
        var $this=this;
        fetch("docs.json").then(function(response) {
            if (response.status !== 200) {  
                this.setState({error: { code: response.status }});
                return;  
            }

            response.json().then(function(data) {  
                $this.setState({docs: data});
            });  
        });
    }
    componentDidMount() {
        this.load();
    }
    onChange(event) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        const q = event.target.value;
        this.timer = setTimeout(function() {
            if (q == '') {
                browserHistory.push('');
            } else {
                browserHistory.push('?q=' + q);
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
                <form className="form-inline">
                    <div className="form-group">
                          <label>Filter</label><input className="form-control" onChange={this.onChange.bind(this)} value={ this.state.q }/>
                    </div>
                </form>
                <table className="table table-bordered table-hover table-condensed">
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
                        <Row doc={doc} />
                      )
                    }
                    </tbody>
                </table>
            </div>
    }
}

ReactDOM.render((
  <Router history={browserHistory}>
      <Route path='*' component={RootView} />
  </Router>
), document.getElementById('app'))




