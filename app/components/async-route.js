const React = require('react');

const LoadingRoute = () => <div>loading</div>;

class AsyncRoute extends React.Component {

  constructor(props){
    super(props);
    this.resolveModule = this.resolveModule.bind(this);
    this.state = {
      component: 'then' in props.component ? null : props.component,
    };
  }

  componentDidMount(){
    if(!this.state.component){
      this.resolveModule()
    }
  }

  resolveModule(){
    this.loading = true;
    if(typeof window !== 'undefined'){
      this.props.component.then(component => {
        this.setState({
          component: component
        });
      });
    }
  }

  render(){
    return this.state.component ? <this.state.component {...this.props} /> : <LoadingRoute key={Math.random()} {...this.props}/>

  }

}

module.exports = AsyncRoute;
