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

const enable = (isDisabled) => {
    document.querySelectorAll("[data-option]").forEach(button => button.disabled = isDisabled)
}

let state = {
    total_rounds: undefined,
    rounds_played: 0,
    wins: {
        user: 0,
        ai: 0,
    },
}

enable(true)

const startGame = () => {
    state.total_rounds = parseInt(document.getElementById("rounds").value)

    if (typeof (state.total_rounds) === "number" && state.total_rounds > 0) {
        enable(false)
    }
}

const getUserChoice = (self) => {
    state.rounds_played += 1

    if (state.total_rounds <= state.rounds_played) {
        enable(true)

        const winner_span = document.createElement("p")
        winner_span.innerText = getOverallWinner()
        document.getElementById("winner_results").before(winner_span)
    }

    const ai_choice = getAISelection()
    handleEmojiDisplay(self.dataset.option, ai_choice.name)
}

const getOverallWinner = () => {
    const user_wins = state.wins.user
    const ai_wins = state.wins.ai

    if (user_wins === ai_wins) return `Overall winner: Tie`
    else if (user_wins > ai_wins) return `Overall winner: User`
    else return `Overall winner: AI`
}

const getAISelection = () => {
    const random_ai_selection = Math.floor(Math.random() * CHOICES.length)
    return CHOICES[random_ai_selection]
}

const getMatchWinner = (user, ai) => {
    if (user.beats.includes(ai.name)) {
        state.wins.user += 1
        return user
    } else if (ai.beats.includes(user.name)) {
        state.wins.ai += 1
        return ai
    } else {
        state.wins.ai += 1
        state.wins.user += 1
        return "tie"
    }
}

const handleEmojiDisplay = (user_choice, ai_choice) => {
    const user_span = document.createElement("span")
    const ai_span = document.createElement("span")
    const match_span = document.createElement("span")

    const user = CHOICES.find(item => item.name === user_choice)
    const ai = CHOICES.find(item => item.name === ai_choice)
    const winner = getMatchWinner(user, ai)

    user_span.innerText = user.emoji
    ai_span.innerText = ai.emoji
    match_span.innerText = winner.emoji ? winner.emoji : winner

    document.getElementById("user_results").before(user_span)
    document.getElementById("ai_results").before(ai_span)
    document.getElementById("match_results").before(match_span)

}
