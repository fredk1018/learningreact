class CommentBox extends React.Component{
	constructor(){
		super()
		this.state = {
			showComments: false,
			comments:[
				{id: 1, author: 'Morgain McCircuit', body: 'Great picture!'},
				{id: 2, author: 'Inspector Gadget', body: 'its all crap'}
			]
		}
	}
	render(){
		const comments = this._getComments()
		let commentNodes
		let buttonText = 'Show Comments'
		if(this.state.showComments){
			buttonText = 'Hide Comments'
			commentNodes=<div className="comment-list">{comments}</div>
		}
		return(
			<div className="comment-box">
				<CommentForm addComment={this._addComment.bind(this)}/>
				<h3>Comments</h3>
				<h4 className="comment-count">{this._getCommentsTitle(comments.length)}</h4>
				{commentNodes}
				<button onClick={this._handleClick.bind(this)}>{buttonText}</button>
			</div>
		)
	}
	_addComment(author,body){
		const comment={
			id: Date.now(),
			author,
			body
		}
		this.setState({comments: this.state.comments.concat([comment])})
	}
	_getComments(){
		return this.state.comments.map((comment)=>{
			return (
				<Comment deleteComment={this._deleteComment.bind(this)} author={comment.author} body={comment.body} id={comment.id} key={comment.id} />
			)
		})
	}
	_deleteComment(id){
		let comments = this.state.comments;
		if(comments.length==1){
			comments=[]
		}else{
			for(let comment of comments){
				if(comment.id == id){
					let index = comments.indexOf(comment)
					comments.splice(index,1)
				}
			}
		}
		this.setState({comments:comments})
	}
	_getCommentsTitle(commentCount){
		if(commentCount === 0){
			return 'No comments yet'
		}else if(commentCount ===1){
			return '1 comment'
		}else{
			return `${commentCount} comments`
		}
	}
	_handleClick(){
		this.setState({
			showComments: !this.state.showComments
		})
	}
}
class CommentForm extends React.Component{
	constructor(){
		super()
		this.state = {
      		characters: 0
    	}
	}
	render(){
		return(
		<form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
			<label> Join the discussion</label>
			<div className="comment-form-fields">
				<input placeholder="Name:" ref={(input)=>this._author = input}/>
				<textarea placeholder="Comment:"ref={(textArea)=>this._body = textArea} onKeyUp={this._getCharacterCount.bind(this)}></textarea>
			</div>
			<p>{this.state.characters} characters</p>
			<div className="comment-form-actions">
				<button type="submit">
					Post Comment
				</button>
			</div>
		</form>
		)
	}
	_handleSubmit(e){
		e.preventDefault()
		
		if (!this._author.value || !this._body.value) {
      		alert('Please enter your name and comment.');
      		return;
    	}

		this.props.addComment(this._author.value,this._body.value)

		this._author.value = ''
		this._body.value = ''
		this.setState({characters:0})
	}

	_getCharacterCount(){
		this.setState({
			characters: this._body.value.length
		})
	}
}
class Comment extends React.Component{
	constructor(){
		super()
		this.state = {
			isAbusive:false
		}
	}
	render(){
		let commentBody
		if(!this.state.isAbusive){
			commentBody = this.props.body
		}else{
			commentBody = <em> Content marked as abusive</em>
		}
		return(
			<div className="comment">
				<p className="comment-header">{this.props.author}</p>
				<p className="comment-body">
					{commentBody}
				</p>
				<div className="comment-footer">
					<a href="#" className="comment-footer-delete" onClick={this._deleteComment.bind(this)}>
						Delete Comment
					</a>
					<a href="#" className="comment-footer-report" onClick={this._isAbusive.bind(this)}>
						Report as Abuse
					</a>
				</div>
			</div>
		)
	}
	_isAbusive(e){
		e.preventDefault()

		this.setState({
			isAbusive:!this.state.isAbusive
		})
	}
	_deleteComment(e){
		e.preventDefault()

		this.props.deleteComment(this.props.id)
	}
}

ReactDOM.render(
	<CommentBox />, document.getElementById('story-app')
)