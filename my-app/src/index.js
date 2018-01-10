import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

function Square(props) {
    return (
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
    );
}
  
  class Board extends React.Component {
      
    renderSquare(index) {
      return <Square value={this.props.squares[index]}  onClick={() => this.props.onClick(index)} />;
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          history: [{squares: Array(9).fill(null)}],
          stepInPlay: 0,
          currentPlayer: 'X', 
          nextPlayer: 'O', 
          winner: null
        };
    }

    timetravelTo(stepInPlay){
        const newHistory = this.state.history.slice(0, stepInPlay + 1);
        this.setState({
            history: newHistory,
            currentPlayer:this.state.stepInPlay % 2 !== 0 ? 'X' : 'O',
            nextPlayer:  this.state.stepInPlay % 2 === 0 ? 'X' : 'O',
            stepInPlay: this.state.stepInPlay, 
            winner: this.calculateWinner(newHistory[newHistory.length-1])
        });
    }

    handleClick(index){

        //Check if someone's not already taken this square.
        const history = this.state.history.slice();
        const squares = history[history.length - 1].squares.slice();
        
        if(squares[index] == null){
            
            //Update square with player token
            squares[index] = this.state.currentPlayer;
            
            //add changed square layout to history
            history.push({squares:squares});
            
            //Finally update state
            this.setState({
                history: history,                 
                currentPlayer: this.state.nextPlayer, //Switch players
                nextPlayer: this.state.currentPlayer, 
                winner: this.calculateWinner(squares), //Calculate whether new board state has a winenr
                stepInPlay: this.state.stepInPlay + 1
            });
        }
    }

    calculateWinner(squares) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
      }

    render() {
        const moves = this.state.history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                <button onClick={() => this.timetravelTo(move)}>{desc}</button>
                </li>
            );
        });

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={this.state.history[this.state.history.length-1].squares} onClick={(index) => this.handleClick(index)} />
          </div>
          <div className="game-info">
            <div>{this.state.winner == null ? "whos gonna win?!" : this.state.winner + " is the winner!"}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  