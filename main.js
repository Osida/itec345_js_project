const CHOICES = [
    {
        name: 'rock',
        emoji: "🪨",
        beats: ['lizard', 'scissors']
    },
    {
        name: 'scissors',
        emoji: "✂",
        beats: ['paper', 'lizard']
    },
    {
        name: 'paper',
        emoji: "📃",
        beats: ['rock', 'spock']
    },
    {
        name: 'lizard',
        emoji: "🐉",
        beats: ['spock', 'paper']
    },
    {
        name: 'spock',
        emoji: "🖖",
        beats: ['scissors', 'rock']
    }
]

let GAME = undefined

class Game {
    constructor(choices, rounds) {
        this.choices = choices
        this.rounds = rounds
        this.rounds_played = 0
        this.ai = {player: "ai", wins: 0,}
        this.user = {player: "user", wins: 0,}
        this.match_winner = undefined
        this.overall_winner = undefined
    }

    generateAIChoice() {
        const random_choice = Math.floor(Math.random() * this.choices.length)
        this.ai = {
            ...this.ai,
            ...this.choices[random_choice]
        }
    }

    generateUserChoice(user_choice) {
        this.user = {
            ...this.user,
            ...this.choices.find(item => item.name === user_choice)
        }
    }

    setMatchWinner(winner) {
        this.match_winner = winner
    }

    setWins(player, amount) {
        player.wins += amount
    }

    incrementRoundsPlayed() {
        this.rounds_played += 1
    }

    decideMatchWinner() {
        if (this.user.beats.includes(this.ai.name)) {
            this.setWins(this.user, 1)
            this.setMatchWinner("User")
        } else if (this.ai.beats.includes(this.user.name)) {
            this.setWins(this.ai, 1)
            this.setMatchWinner("AI")
        } else {
            this.setWins(this.ai, 1)
            this.setWins(this.user, 1)
            this.setMatchWinner("Tie")
        }
    }

    getOverallWinner() {
        if (this.user.wins === this.ai.wins)
            this.overall_winner = "Tie"
        else if (this.user.wins > this.ai.wins)
            this.overall_winner = "User"
        else
            this.overall_winner = "AI"
    }
}

const getInputRounds = () => parseInt(document.getElementById("rounds").value)


const enableButtons = (isEnabled) =>
    document.querySelectorAll("[data-option]").forEach(button => button.disabled = isEnabled)


const startGame = () => {
    const rounds = getInputRounds()
    const validate = typeof rounds === "number" && rounds > 0

    if (!validate) {
        enableButtons(true)
        alert(`ERROR! The number rounds must be greater than 0.`)
    } else {
        enableButtons(false)
        GAME = new Game(CHOICES, rounds)
    }
}

const getUserChoice = (self) => {
    const validate = GAME.rounds_played >= GAME.rounds

    if (validate) {
        enableButtons(true)
        handleOverallWinnerDisplay()
    } else {
        GAME.generateAIChoice()
        GAME.generateUserChoice(self.dataset.option)
        GAME.decideMatchWinner()
        handleEmojiDisplay()
        GAME.incrementRoundsPlayed()
    }
}

const handleEmojiDisplay = () => {
    insertNewElement("span", "user_results", GAME.user.emoji)
    insertNewElement("span", "ai_results", GAME.ai.emoji)
    insertNewElement("span", "match_results", GAME.match_winner)
}

const handleOverallWinnerDisplay = () => {
    GAME.getOverallWinner()
    let text

    if (GAME.overall_winner === "User")
        text = `User won ${GAME.user.wins} out of ${GAME.rounds} rounds`
    else if (GAME.overall_winner === "AI")
        text = `AI won ${GAME.ai.wins} out of ${GAME.rounds} rounds`
    else
        text = `Its a Tie out of ${GAME.rounds}`


    insertNewElement("h3", "winner_results", text)
}

const insertNewElement = (tagName, elementId, emoji) => {
    const element = document.createElement(tagName)
    const parent = document.getElementById(elementId)
    parent.appendChild(element)
    element.innerText = emoji
}