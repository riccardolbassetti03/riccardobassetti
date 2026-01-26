<template>
  <div class="game-container">
    <NavBar />
    
    <!-- Overlay istruzioni (aperto automaticamente) -->
    <div v-if="showInfo" class="info-overlay" @click.self="showInfo = false">
      <div class="info-content">
        <h2><strong>Game Rules</strong></h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
  To celebrate the launch of SS@3, we are hosting an exciting giveaway! try to win our new product<br /><br />
  To participate in our raffle, you need to reach a secret high score — but beware, no one knows the exact number!<br /><br />
  Jump with spacebar to avoid the paparazzi and collect as many coins as you can.<br />
  The raffle will take place in June — good luck and have fun! 
</p>
        <button class="btn" @click="showInfo = false">Close</button>
      </div>
    </div>

    <div class="game-wrapper" :class="cursorVisibleClass" @click="handleCanvasClick">
      <canvas ref="gameCanvas"></canvas>
      <img
        v-if="!gameStarted && !gameOver"
        class="start-screen"
        src="@/assets/game/start.png"
        alt="Start Game"
        @click.stop="startGame"
      />
      <img
        v-if="gameOver && score < winScore"
        class="gameover-screen"
        src="@/assets/game/gameover.png"
        alt="Game Over"
        @click.stop="restartGame"
      />
    </div>
  </div>
</template>
  
<script>
import NavBar from '@/components/NavBar.vue';

import background from '@/assets/game/background.png';
import playerRun1 from '@/assets/game/player/run1.png';
import playerRun2 from '@/assets/game/player/run2.png';
import playerJump from '@/assets/game/player/jump.png';
import enemyImage from '@/assets/game/enemy/paparazzi.png';
import enemyImageFlash from '@/assets/game/enemy/paparazziflash.png';
import coinImage from '@/assets/game/coin.png';
import gameOverImage from '@/assets/game/gameover.png';

export default {
  name: 'Game',
  components: {
    NavBar
  },
  data() {
    return {
      ctx: null,
      canvas: null,
      gameWidth: window.innerWidth,
      gameHeight: window.innerHeight,
      backgroundImage: new Image(),
      playerRun1: new Image(),
      playerRun2: new Image(),
      playerJump: new Image(),
      enemyImage: new Image(),
      enemyFlashImage: new Image(),
      coinImage: new Image(),
      gameOverImage: new Image(),
      playerX: 100,
      playerY: 0,
      playerWidth: 100,
      playerHeight: 140,
      gravity: 0.8,
      jumpPower: -25,
      velocityY: 0,
      onGround: true,
      enemyX: 0,
      enemyY: 0,
      coinX: 0,
      coinY: 0,
      playerFrame: 0,
      enemyFrame: 0,
      backgroundX: 0,
      score: 0,
      gameOver: false,
      gameStarted: false,
      assetsLoaded: false,
      gameTimer: 0,
      startTime: null,
      winScore: 1,
      cursorVisible: true,// Gestiamo la visibilità del cursore
      showInfo: false
    };
  },
  mounted() {
    this.canvas = this.$refs.gameCanvas;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    this.initAssets();
    window.addEventListener('keydown', this.handleJump);
    window.addEventListener('resize', this.resizeCanvas);
    this.loop();

    this.toggleCursorVisibility(true);
    
    // Apri overlay info automaticamente all’ingresso
    this.showInfo = true;
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleJump);
    window.removeEventListener('resize', this.resizeCanvas);
    this.toggleCursorVisibility(true); // Assicurati che il cursore sia visibile quando si lascia la pagina
  },
  computed: {
    // Classe dinamica per la visibilità del cursore
    cursorVisibleClass() {
      return this.cursorVisible ? 'cursor-visible' : 'cursor-hidden';
    }
  },
  methods: {
    resizeCanvas() {
      this.gameWidth = window.innerWidth;
      this.gameHeight = window.innerHeight;
      this.canvas.width = this.gameWidth;
      this.canvas.height = this.gameHeight;
      this.playerY = this.gameHeight - this.playerHeight - 50;
      this.enemyX = this.gameWidth + 300;
      this.enemyY = this.gameHeight - 205;
      this.coinX = this.gameWidth + 600;
      this.coinY = this.gameHeight - 180;
    },

    initAssets() {
      this.backgroundImage.src = background;
      this.playerRun1.src = playerRun1;
      this.playerRun2.src = playerRun2;
      this.playerJump.src = playerJump;
      this.enemyImage.src = enemyImage;
      this.enemyFlashImage.src = enemyImageFlash;
      this.coinImage.src = coinImage;
      this.gameOverImage.src = gameOverImage;

      const images = [
        this.backgroundImage,
        this.playerRun1,
        this.playerRun2,
        this.playerJump,
        this.enemyImage,
        this.enemyFlashImage,
        this.coinImage,
        this.gameOverImage,
      ];

      Promise.all(images.map((img) => new Promise((res) => (img.onload = res)))).then(() => {
        this.assetsLoaded = true;
      });
    },

    toggleCursorVisibility(isVisible) {
      this.cursorVisible = isVisible;
    },

    handleJump(e) {
      if (e.code === 'Space' && this.onGround && this.gameStarted && !this.gameOver) {
        this.velocityY = this.jumpPower;
        this.onGround = false;
      }
    },

    handleCanvasClick() {
      if (!this.gameStarted && !this.gameOver) {
        this.startGame();
      }
    },

    startGame() {
      this.gameStarted = true;
      this.gameOver = false;
      this.score = 0;
      this.velocityY = 0;
      this.playerY = this.gameHeight - this.playerHeight - 50;
      this.enemyX = this.gameWidth + 300;
      this.coinX = this.gameWidth + 600;
      this.startTime = Date.now();
      this.gameTimer = 0;
      this.toggleCursorVisibility(false); // Nascondi il cursore durante il gioco
    },

    restartGame() {
      this.startGame();
    },

    update() {
      if (!this.assetsLoaded || !this.gameStarted || this.gameOver) return;

      this.playerY += this.velocityY;
      this.velocityY += this.gravity;

      if (this.playerY >= this.gameHeight - this.playerHeight - 50) {
        this.playerY = this.gameHeight - this.playerHeight - 50;
        this.velocityY = 0;
        this.onGround = true;
      }

      this.backgroundX -= 2;
      if (this.backgroundX <= -this.gameWidth) this.backgroundX = 0;

      this.enemyX -= 6;
      this.coinX -= 4;

      if (this.enemyX < -100) {
        this.enemyX = this.gameWidth + Math.random() * 500;
      }
      if (this.coinX < -90) {
        this.coinX = this.gameWidth + Math.random() * 800;
      }

      if (this.checkCollision(this.playerX, this.playerY, this.playerWidth, this.playerHeight, this.enemyX, this.enemyY, 80, 120)) {
        this.gameOver = true;
      }

      if (this.checkCollision(this.playerX, this.playerY, this.playerWidth, this.playerHeight, this.coinX, this.coinY, 90, 90)) {
        this.score++;
        this.coinX = this.gameWidth + Math.random() * 800;
      }

      this.playerFrame = (this.playerFrame + 1) % 30;
      this.enemyFrame = (this.enemyFrame + 1) % 40;

      // timer
      this.gameTimer = Math.floor((Date.now() - this.startTime) / 1000);

      // condizione vittoria
      if (this.score >= this.winScore) {
        this.gameOver = true;
        this.$router.push('/secret'); // Redirect alla pagina /secret
      }
    },

    draw() {
      if (!this.assetsLoaded) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);

      ctx.drawImage(this.backgroundImage, this.backgroundX, 0, this.gameWidth, this.gameHeight);
      ctx.drawImage(this.backgroundImage, this.backgroundX + this.gameWidth, 0, this.gameWidth, this.gameHeight);

      let img = this.onGround ? (this.playerFrame < 15 ? this.playerRun1 : this.playerRun2) : this.playerJump;
      ctx.drawImage(img, this.playerX, this.playerY, this.playerWidth, this.playerHeight);

      const enemyImg = this.enemyFrame < 20 ? this.enemyImage : this.enemyFlashImage;
      ctx.drawImage(enemyImg, this.enemyX, this.enemyY, 100, 150);

      ctx.drawImage(this.coinImage, this.coinX, this.coinY, 150, 150);

      if (this.gameStarted && !this.gameOver) {
        ctx.font = '30px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textAlign = 'right';
      }

      // Mostra la schermata di game over solo se il gioco è finito per la perdita
      if (this.gameOver && this.score < this.winScore) {
        ctx.drawImage(this.gameOverImage, this.gameWidth / 2 - 200, this.gameHeight / 2 - 100, 400, 200);
        // Ripristina il cursore alla fine del gioco (game over)
        this.toggleCursorVisibility(true);
      }
    },

    loop() {
      this.update();
      this.draw();
      requestAnimationFrame(this.loop);
    },

    checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
      return (
        x1 < x2 + w2 &&
        x1 + w1 > x2 &&
        y1 < y2 + h2 &&
        y1 + h1 > y2
      );
    }
  },
};
</script>
  
<style scoped>
.info-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
}

.info-content {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  max-width: 800px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
}

.info-content h2 {
  margin-bottom: 20px;
}

.info-content p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 30px;
  color: #333;
}

.btn {
  background-color: #e89c4a;
  border: none;
  padding: 10px 25px;
  font-weight: bold;
  color: black;
  width: 200px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #E65C00;
  color: white;
}

.game-wrapper {
  position: absolute;
  top: 50px; /* lascia spazio per la navbar */
  left: 0;
  width: 100%;
  height: calc(100% - 50px);
  z-index: 1;
}

.cursor-visible {
  cursor: default;
}

.cursor-hidden {
  cursor: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* Mostra il cursore quando il gioco è finito o prima di premere Start */
.gameover-screen,
.start-screen {
  cursor: pointer;
}

nav {
  position: relative;
  z-index: 10;
}

.start-screen,
.gameover-screen {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;  /* Modifica la larghezza */
  height: 500px; /* Modifica l'altezza */
  transform: translate(-50%, -50%);
  animation: pulse 1.5s infinite;
}  

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
</style>
