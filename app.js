function getRandomValue(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
	data() {
		return{
			playerHealth: 100,
			monsterHealth: 100,
			currentRound: 0,
			winner: null,
			battleLog: []
		};
	},
	computed: {
		monsterBar(){
			if(this.monsterHealth < 0) {
				return {width: '0%'}; 
			}
			return {width: this.monsterHealth + '%'};
		}, 
		playerBar(){
			if(this.playerHealth < 0) {
				return {width: '0%'};
			}
			return {width: this.playerHealth + '%'};
		},
		useSpecialAttack() {
			return this.currentRound % 3 !== 0 || this.currentRound == 0;
		}
	},
	watch: {
		playerHealth(value) {
			if(value <= 0 && this.monsterHealth <= 0) {
				// DRAW
				this.winner = 'draw';
			} else if(value <= 0) {
				// PLAYER LOST
				this.winner = 'monster';
			}
		},
		monsterHealth(value) {
			if(value <= 0 && this.playerHealth <= 0) {
				// DRAW
				this.winner = 'draw';
			} else if(value <= 0) {
				// MONSTER LOST
				this.winner = 'player';
			}
		}
	},
	methods: {
		attackMonster() {
			this.currentRound++;
			const attackValue = getRandomValue(5, 12);
			this.monsterHealth -= attackValue;
			this.addLogBattle('player', 'attack', attackValue);
			this.attackPlayer();
		},
		attackPlayer() {
			const attackValue = getRandomValue(8, 15);
			this.playerHealth -= attackValue;
			this.addLogBattle('monster', 'attack', attackValue);
		},
		specialAttackMonster() {
			this.currentRound++;
			const attackValue = getRandomValue(10, 25);
			this.monsterHealth -= attackValue;
			this.addLogBattle('player', 'attack', attackValue);
			this.attackPlayer();
		},
		healPlayer() {
			this.currentRound++;
			const healValue = getRandomValue(8, 20);
			if(this.playerHealth + healValue > 100) {
				this.playerHealth = 100;
			} else {
				this.playerHealth += healValue;
			}
			this.addLogBattle('player', 'heal', healValue);
			this.attackPlayer();
		},
		reset(){
			this.playerHealth = 100;
			this.monsterHealth = 100;
			this.currentRound = 0;
			this.winner = null;
			this.battleLog = [];
		},
		surrender() {
			this.winner = 'monster';
		},
		addLogBattle(who, what, value) {
			this.battleLog.unshift({
				actionBy: who,
				actionType: what,
				actionValue: value
			})
		}
	},
});

app.mount('#game');