// ============================================================
// POKEMON NOVARA - Sprite Renderer (Procedural pixel art)
// ============================================================

const SpriteRenderer = {
    cache: {},
    _cacheOrder: [],
    _maxCacheSize: 200,

    // Draw a Pokemon sprite on canvas
    drawPokemon(ctx, pokemonId, x, y, size, facing = 'front', isShiny = false) {
        const key = `${pokemonId}_${size}_${facing}_${isShiny}`;
        if (!this.cache[key]) {
            // Evict oldest entry if cache is full
            if (this._cacheOrder.length >= this._maxCacheSize) {
                const evict = this._cacheOrder.shift();
                delete this.cache[evict];
            }
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const sctx = canvas.getContext('2d');
            this._generatePokemonSprite(sctx, pokemonId, size, facing, isShiny);
            this.cache[key] = canvas;
            this._cacheOrder.push(key);
        }
        ctx.drawImage(this.cache[key], x, y);
    },

    _generatePokemonSprite(ctx, pokemonId, size, facing, isShiny) {
        const data = getPokemonById(pokemonId);
        if (!data || !data.colors) return;

        const colors = data.colors;
        const s = size / 64; // scale factor
        const types = data.types;

        // Use a seeded approach based on pokemon ID for consistent generation
        const seed = pokemonId * 7 + 13;

        // Body shape based on pokemon type and ID
        const bodyType = this._getBodyType(pokemonId, types);

        const isBack = facing === 'back';

        ctx.save();
        if (isBack) {
            // Mirror + slight vertical shift to show "from behind" perspective
            ctx.translate(size, 0);
            ctx.scale(-1, 1);
        }

        switch (bodyType) {
            case 'quadruped': this._drawQuadruped(ctx, s, colors, types, pokemonId); break;
            case 'biped': this._drawBiped(ctx, s, colors, types, pokemonId); break;
            case 'serpent': this._drawSerpent(ctx, s, colors, types, pokemonId); break;
            case 'bird': this._drawBird(ctx, s, colors, types, pokemonId); break;
            case 'amorphous': this._drawAmorphous(ctx, s, colors, types, pokemonId); break;
            case 'insect': this._drawInsect(ctx, s, colors, types, pokemonId); break;
            case 'aquatic': this._drawAquatic(ctx, s, colors, types, pokemonId); break;
            case 'humanoid': this._drawHumanoid(ctx, s, colors, types, pokemonId); break;
            case 'dragon': this._drawDragon(ctx, s, colors, types, pokemonId); break;
            case 'mineral': this._drawMineral(ctx, s, colors, types, pokemonId); break;
            default: this._drawBiped(ctx, s, colors, types, pokemonId); break;
        }

        // Back-facing: overlay dorsal markings and hide face
        if (isBack) {
            const bodyCol = colors.body || colors.primary || '#888';
            const accentCol = colors.belly || colors.secondary || bodyCol;
            // Cover face area with body color (hide eyes/mouth)
            ctx.fillStyle = bodyCol;
            ctx.fillRect(s * 20, s * 10, s * 24, s * 14);
            // Draw dorsal stripe / spine marking
            ctx.fillStyle = accentCol;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(s * 29, s * 14, s * 6, s * 28);
            // Small dorsal spots
            for (let i = 0; i < 3; i++) {
                const sy = s * (18 + i * 8);
                ctx.beginPath();
                ctx.arc(s * 32, sy, s * 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1.0;
        }

        // Shiny sparkle effect
        if (isShiny) {
            this._drawSparkles(ctx, size);
        }

        ctx.restore();
    },

    _getBodyType(id, types) {
        // Assign body type based on ID ranges and types
        if ([15, 16, 17, 49, 50, 59, 60, 70, 71, 80, 81].includes(id)) return 'insect';
        if ([12, 13, 14, 26, 27, 51, 52, 72, 73, 94, 95, 107, 122].includes(id)) return 'bird';
        if ([4, 5, 6, 20, 21, 47, 48, 53, 54, 68, 69, 78, 79, 111, 113, 119, 126, 127, 130, 137, 145].includes(id)) return 'aquatic';
        if ([34, 35, 36, 86, 87, 108, 116, 120, 121].includes(id)) return 'amorphous';
        if ([3, 65, 66, 67, 88, 89, 118, 131, 132, 136, 140, 147, 150].includes(id)) return 'dragon';
        if ([24, 25, 28, 29, 30, 31, 37, 38, 76, 77, 106, 139].includes(id)) return 'mineral';
        if ([32, 33, 128, 129, 133].includes(id)) return 'serpent';
        if ([43, 44, 55, 56, 82, 83, 92, 93, 109, 112, 117].includes(id)) return 'humanoid';
        if ([10, 11, 45, 46, 61, 62, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 114, 125].includes(id)) return 'quadruped';
        if ([1, 2, 7, 8, 9, 18, 19, 22, 23, 39, 40, 41, 42, 57, 58, 63, 64, 74, 75, 84, 85, 90, 91, 110, 115, 123, 124, 134, 135, 138, 141, 142, 143, 144, 146, 148, 149].includes(id)) return 'biped';
        return 'biped';
    },

    _drawBiped(ctx, s, colors, types, id) {
        const bodyColor = colors.body || '#888';
        const bellyColor = colors.belly || this._lighten(bodyColor, 40);
        const eyeColor = colors.eyes || '#000';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(32*s, 58*s, 14*s, 4*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Body
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 20*s, 20*s, 24*s, 30*s, 8*s);

        // Belly
        ctx.fillStyle = bellyColor;
        this._roundRect(ctx, 24*s, 28*s, 16*s, 18*s, 6*s);

        // Head
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 18*s, 6*s, 28*s, 22*s, 10*s);

        // Eyes
        ctx.fillStyle = '#FFF';
        this._roundRect(ctx, 24*s, 12*s, 8*s, 8*s, 3*s);
        this._roundRect(ctx, 36*s, 12*s, 8*s, 8*s, 3*s);
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(29*s, 16*s, 2.5*s, 0, Math.PI*2);
        ctx.arc(41*s, 16*s, 2.5*s, 0, Math.PI*2);
        ctx.fill();

        // Arms
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 12*s, 24*s, 10*s, 6*s, 3*s);
        this._roundRect(ctx, 42*s, 24*s, 10*s, 6*s, 3*s);

        // Legs
        this._roundRect(ctx, 22*s, 48*s, 8*s, 10*s, 3*s);
        this._roundRect(ctx, 34*s, 48*s, 8*s, 10*s, 3*s);

        // Type-specific decorations
        this._addTypeDecoration(ctx, s, colors, types, id);
    },

    _drawQuadruped(ctx, s, colors, types, id) {
        const bodyColor = colors.body || '#888';
        const bellyColor = colors.belly || this._lighten(bodyColor, 40);
        const eyeColor = colors.eyes || '#000';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(32*s, 58*s, 18*s, 4*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Body
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 14*s, 28*s, 36*s, 20*s, 8*s);

        // Belly
        ctx.fillStyle = bellyColor;
        this._roundRect(ctx, 18*s, 34*s, 28*s, 12*s, 5*s);

        // Head
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 30*s, 8*s, 24*s, 22*s, 8*s);

        // Eyes
        ctx.fillStyle = '#FFF';
        this._roundRect(ctx, 38*s, 14*s, 7*s, 7*s, 3*s);
        this._roundRect(ctx, 48*s, 14*s, 7*s, 7*s, 3*s);
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(42*s, 17*s, 2*s, 0, Math.PI*2);
        ctx.arc(52*s, 17*s, 2*s, 0, Math.PI*2);
        ctx.fill();

        // Legs
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 16*s, 46*s, 8*s, 12*s, 3*s);
        this._roundRect(ctx, 28*s, 46*s, 8*s, 12*s, 3*s);
        this._roundRect(ctx, 38*s, 46*s, 8*s, 10*s, 3*s);
        this._roundRect(ctx, 44*s, 46*s, 8*s, 10*s, 3*s);

        // Tail
        ctx.fillStyle = colors.tail || bodyColor;
        ctx.beginPath();
        ctx.moveTo(14*s, 32*s);
        ctx.quadraticCurveTo(4*s, 26*s, 8*s, 18*s);
        ctx.quadraticCurveTo(12*s, 20*s, 16*s, 30*s);
        ctx.fill();

        this._addTypeDecoration(ctx, s, colors, types, id);
    },

    _drawBird(ctx, s, colors, types, id) {
        const bodyColor = colors.body || '#888';
        const wingColor = colors.wings || this._darken(bodyColor, 30);
        const eyeColor = colors.eyes || '#000';
        const beakColor = colors.beak || '#FFD700';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(32*s, 58*s, 12*s, 3*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Wings
        ctx.fillStyle = wingColor;
        ctx.beginPath();
        ctx.moveTo(10*s, 28*s);
        ctx.quadraticCurveTo(2*s, 18*s, 6*s, 12*s);
        ctx.quadraticCurveTo(14*s, 16*s, 20*s, 26*s);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(54*s, 28*s);
        ctx.quadraticCurveTo(62*s, 18*s, 58*s, 12*s);
        ctx.quadraticCurveTo(50*s, 16*s, 44*s, 26*s);
        ctx.fill();

        // Body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(32*s, 34*s, 14*s, 16*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Breast
        ctx.fillStyle = colors.breast || this._lighten(bodyColor, 40);
        ctx.beginPath();
        ctx.ellipse(32*s, 38*s, 10*s, 10*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Head
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(32*s, 16*s, 10*s, 10*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(27*s, 14*s, 4*s, 0, Math.PI*2);
        ctx.arc(37*s, 14*s, 4*s, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(28*s, 14*s, 2*s, 0, Math.PI*2);
        ctx.arc(38*s, 14*s, 2*s, 0, Math.PI*2);
        ctx.fill();

        // Beak
        ctx.fillStyle = beakColor;
        ctx.beginPath();
        ctx.moveTo(30*s, 18*s);
        ctx.lineTo(32*s, 24*s);
        ctx.lineTo(34*s, 18*s);
        ctx.fill();

        // Crest
        if (colors.crest) {
            ctx.fillStyle = colors.crest;
            ctx.beginPath();
            ctx.moveTo(28*s, 8*s);
            ctx.quadraticCurveTo(32*s, 2*s, 36*s, 8*s);
            ctx.fill();
        }

        // Tail
        ctx.fillStyle = colors.tail || wingColor;
        ctx.beginPath();
        ctx.moveTo(28*s, 48*s);
        ctx.quadraticCurveTo(22*s, 56*s, 18*s, 58*s);
        ctx.lineTo(32*s, 52*s);
        ctx.quadraticCurveTo(36*s, 56*s, 32*s, 58*s);
        ctx.lineTo(36*s, 52*s);
        ctx.quadraticCurveTo(42*s, 56*s, 46*s, 58*s);
        ctx.lineTo(36*s, 48*s);
        ctx.fill();

        this._addTypeDecoration(ctx, s, colors, types, id);
    },

    _drawSerpent(ctx, s, colors, types, id) {
        const bodyColor = colors.body || '#888';
        const bellyColor = colors.belly || this._lighten(bodyColor, 40);
        const eyeColor = colors.eyes || '#000';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(32*s, 58*s, 20*s, 3*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Body coils
        ctx.fillStyle = bodyColor;
        ctx.lineWidth = 10*s;
        ctx.strokeStyle = bodyColor;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48*s, 52*s);
        ctx.quadraticCurveTo(56*s, 40*s, 44*s, 34*s);
        ctx.quadraticCurveTo(20*s, 26*s, 24*s, 38*s);
        ctx.quadraticCurveTo(28*s, 50*s, 40*s, 44*s);
        ctx.stroke();

        // Belly stripe
        ctx.lineWidth = 6*s;
        ctx.strokeStyle = bellyColor;
        ctx.beginPath();
        ctx.moveTo(48*s, 52*s);
        ctx.quadraticCurveTo(56*s, 40*s, 44*s, 34*s);
        ctx.stroke();

        // Head
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 14*s, 8*s, 22*s, 18*s, 6*s);

        // Eyes
        ctx.fillStyle = '#FFF';
        this._roundRect(ctx, 18*s, 12*s, 6*s, 6*s, 2*s);
        this._roundRect(ctx, 28*s, 12*s, 6*s, 6*s, 2*s);
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(22*s, 15*s, 2*s, 0, Math.PI*2);
        ctx.arc(32*s, 15*s, 2*s, 0, Math.PI*2);
        ctx.fill();

        // Tongue
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 1.5*s;
        ctx.beginPath();
        ctx.moveTo(24*s, 24*s);
        ctx.lineTo(22*s, 30*s);
        ctx.moveTo(24*s, 24*s);
        ctx.lineTo(26*s, 30*s);
        ctx.stroke();

        this._addTypeDecoration(ctx, s, colors, types, id);
    },

    _drawAquatic(ctx, s, colors, types, id) {
        const bodyColor = colors.body || '#4682B4';
        const bellyColor = colors.belly || this._lighten(bodyColor, 40);
        const eyeColor = colors.eyes || '#000';
        const finColor = colors.fins || this._darken(bodyColor, 30);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(32*s, 56*s, 16*s, 4*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Tail fin
        ctx.fillStyle = finColor;
        ctx.beginPath();
        ctx.moveTo(8*s, 32*s);
        ctx.quadraticCurveTo(2*s, 24*s, 6*s, 18*s);
        ctx.quadraticCurveTo(10*s, 24*s, 14*s, 28*s);
        ctx.quadraticCurveTo(10*s, 36*s, 6*s, 44*s);
        ctx.quadraticCurveTo(2*s, 40*s, 8*s, 32*s);
        ctx.fill();

        // Body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(34*s, 32*s, 20*s, 16*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Belly
        ctx.fillStyle = bellyColor;
        ctx.beginPath();
        ctx.ellipse(36*s, 38*s, 14*s, 8*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Top fin
        ctx.fillStyle = finColor;
        ctx.beginPath();
        ctx.moveTo(30*s, 18*s);
        ctx.quadraticCurveTo(34*s, 8*s, 40*s, 10*s);
        ctx.quadraticCurveTo(38*s, 16*s, 36*s, 18*s);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(44*s, 28*s, 5*s, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(45*s, 28*s, 2.5*s, 0, Math.PI*2);
        ctx.fill();

        this._addTypeDecoration(ctx, s, colors, types, id);
    },

    _drawDragon(ctx, s, colors, types, id) {
        const bodyColor = colors.body || '#4169E1';
        const bellyColor = colors.belly || this._lighten(bodyColor, 40);
        const wingColor = colors.wings || this._darken(bodyColor, 20);
        const eyeColor = colors.eyes || '#FFD700';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(32*s, 58*s, 16*s, 4*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Wings
        ctx.fillStyle = wingColor;
        ctx.beginPath();
        ctx.moveTo(14*s, 24*s);
        ctx.lineTo(2*s, 8*s);
        ctx.lineTo(8*s, 16*s);
        ctx.lineTo(12*s, 6*s);
        ctx.lineTo(16*s, 18*s);
        ctx.lineTo(18*s, 24*s);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(50*s, 24*s);
        ctx.lineTo(62*s, 8*s);
        ctx.lineTo(56*s, 16*s);
        ctx.lineTo(52*s, 6*s);
        ctx.lineTo(48*s, 18*s);
        ctx.lineTo(46*s, 24*s);
        ctx.fill();

        // Body
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 20*s, 20*s, 24*s, 28*s, 8*s);

        // Belly
        ctx.fillStyle = bellyColor;
        this._roundRect(ctx, 24*s, 26*s, 16*s, 18*s, 5*s);

        // Head
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 18*s, 4*s, 28*s, 20*s, 8*s);

        // Horns
        ctx.fillStyle = colors.horns || '#DAA520';
        ctx.beginPath();
        ctx.moveTo(22*s, 8*s);
        ctx.lineTo(18*s, 0);
        ctx.lineTo(26*s, 6*s);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(42*s, 8*s);
        ctx.lineTo(46*s, 0);
        ctx.lineTo(38*s, 6*s);
        ctx.fill();

        // Eyes
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.ellipse(26*s, 12*s, 4*s, 3*s, 0, 0, Math.PI*2);
        ctx.ellipse(38*s, 12*s, 4*s, 3*s, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(27*s, 12*s, 2*s, 2.5*s, 0, 0, Math.PI*2);
        ctx.ellipse(39*s, 12*s, 2*s, 2.5*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Mouth
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1*s;
        ctx.beginPath();
        ctx.moveTo(28*s, 18*s);
        ctx.quadraticCurveTo(32*s, 22*s, 36*s, 18*s);
        ctx.stroke();

        // Tail
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(28*s, 46*s);
        ctx.quadraticCurveTo(18*s, 52*s, 12*s, 56*s);
        ctx.quadraticCurveTo(14*s, 52*s, 30*s, 46*s);
        ctx.fill();

        // Legs
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 22*s, 46*s, 8*s, 10*s, 3*s);
        this._roundRect(ctx, 34*s, 46*s, 8*s, 10*s, 3*s);

        // Claws
        ctx.fillStyle = colors.claws || '#C0C0C0';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect((23+i*2)*s, 54*s, 2*s, 3*s);
            ctx.fillRect((35+i*2)*s, 54*s, 2*s, 3*s);
        }
    },

    _drawAmorphous(ctx, s, colors, types, id) {
        const bodyColor = colors.body || '#9370DB';
        const eyeColor = colors.eyes || '#FF0000';
        const auraColor = colors.aura || this._lighten(bodyColor, 30);

        // Aura/glow
        ctx.fillStyle = auraColor + '40';
        ctx.beginPath();
        ctx.ellipse(32*s, 32*s, 24*s, 24*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Main body (blobby)
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(20*s, 50*s);
        ctx.quadraticCurveTo(8*s, 40*s, 12*s, 24*s);
        ctx.quadraticCurveTo(16*s, 10*s, 32*s, 8*s);
        ctx.quadraticCurveTo(48*s, 10*s, 52*s, 24*s);
        ctx.quadraticCurveTo(56*s, 40*s, 44*s, 50*s);
        ctx.quadraticCurveTo(32*s, 56*s, 20*s, 50*s);
        ctx.fill();

        // Eyes
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.ellipse(26*s, 24*s, 4*s, 5*s, 0, 0, Math.PI*2);
        ctx.ellipse(38*s, 24*s, 4*s, 5*s, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(27*s, 23*s, 1.5*s, 0, Math.PI*2);
        ctx.arc(39*s, 23*s, 1.5*s, 0, Math.PI*2);
        ctx.fill();

        // Wisps
        if (colors.wisps || colors.glow) {
            ctx.fillStyle = (colors.wisps || colors.glow) + '80';
            for (let i = 0; i < 3; i++) {
                const wx = (20 + i * 12) * s;
                const wy = (40 + Math.sin(i * 2) * 6) * s;
                ctx.beginPath();
                ctx.arc(wx, wy, 3*s, 0, Math.PI*2);
                ctx.fill();
            }
        }

        this._addTypeDecoration(ctx, s, colors, types, id);
    },

    _drawInsect(ctx, s, colors, types, id) {
        const bodyColor = colors.body || '#32CD32';
        const eyeColor = colors.eyes || '#FF0000';
        const shellColor = colors.shell || this._darken(bodyColor, 20);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(32*s, 58*s, 14*s, 3*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Wings (if evolved)
        if (colors.wings) {
            ctx.fillStyle = colors.wings + '80';
            ctx.beginPath();
            ctx.ellipse(18*s, 22*s, 12*s, 8*s, -0.3, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(46*s, 22*s, 12*s, 8*s, 0.3, 0, Math.PI*2);
            ctx.fill();
        }

        // Abdomen
        ctx.fillStyle = shellColor;
        ctx.beginPath();
        ctx.ellipse(32*s, 42*s, 12*s, 14*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Thorax
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(32*s, 26*s, 10*s, 8*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Head
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(32*s, 14*s, 8*s, 8*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(27*s, 12*s, 3*s, 0, Math.PI*2);
        ctx.arc(37*s, 12*s, 3*s, 0, Math.PI*2);
        ctx.fill();

        // Antennae
        ctx.strokeStyle = colors.antennae || bodyColor;
        ctx.lineWidth = 1.5*s;
        ctx.beginPath();
        ctx.moveTo(28*s, 8*s);
        ctx.quadraticCurveTo(22*s, 2*s, 18*s, 4*s);
        ctx.moveTo(36*s, 8*s);
        ctx.quadraticCurveTo(42*s, 2*s, 46*s, 4*s);
        ctx.stroke();

        // Legs
        ctx.strokeStyle = colors.legs || this._darken(bodyColor, 30);
        ctx.lineWidth = 2*s;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(22*s, (24+i*6)*s);
            ctx.lineTo(12*s, (28+i*8)*s);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(42*s, (24+i*6)*s);
            ctx.lineTo(52*s, (28+i*8)*s);
            ctx.stroke();
        }
    },

    _drawHumanoid(ctx, s, colors, types, id) {
        const bodyColor = colors.body || '#888';
        const bellyColor = colors.belly || this._lighten(bodyColor, 30);
        const eyeColor = colors.eyes || '#000';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(32*s, 60*s, 12*s, 3*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Legs
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 24*s, 44*s, 8*s, 16*s, 3*s);
        this._roundRect(ctx, 36*s, 44*s, 8*s, 16*s, 3*s);

        // Body (torso)
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 22*s, 22*s, 20*s, 24*s, 6*s);

        // Belt or marking
        if (colors.belt) {
            ctx.fillStyle = colors.belt;
            this._roundRect(ctx, 22*s, 40*s, 20*s, 4*s, 2*s);
        }

        // Belly
        ctx.fillStyle = bellyColor;
        this._roundRect(ctx, 26*s, 28*s, 12*s, 12*s, 4*s);

        // Arms
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 12*s, 24*s, 12*s, 6*s, 3*s);
        this._roundRect(ctx, 40*s, 24*s, 12*s, 6*s, 3*s);

        // Fists
        ctx.fillStyle = colors.fists || colors.hands || bellyColor;
        ctx.beginPath();
        ctx.arc(12*s, 27*s, 4*s, 0, Math.PI*2);
        ctx.arc(52*s, 27*s, 4*s, 0, Math.PI*2);
        ctx.fill();

        // Head
        ctx.fillStyle = bodyColor;
        this._roundRect(ctx, 20*s, 4*s, 24*s, 20*s, 8*s);

        // Eyes
        ctx.fillStyle = '#FFF';
        this._roundRect(ctx, 26*s, 10*s, 7*s, 6*s, 2*s);
        this._roundRect(ctx, 37*s, 10*s, 7*s, 6*s, 2*s);
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(30*s, 13*s, 2*s, 0, Math.PI*2);
        ctx.arc(41*s, 13*s, 2*s, 0, Math.PI*2);
        ctx.fill();

        this._addTypeDecoration(ctx, s, colors, types, id);
    },

    _drawMineral(ctx, s, colors, types, id) {
        const bodyColor = colors.body || '#808080';
        const crystalColor = colors.crystals || '#FFD700';
        const eyeColor = colors.eyes || '#FFD700';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(32*s, 58*s, 16*s, 4*s, 0, 0, Math.PI*2);
        ctx.fill();

        // Main body (angular rock shape)
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(16*s, 52*s);
        ctx.lineTo(10*s, 32*s);
        ctx.lineTo(18*s, 16*s);
        ctx.lineTo(32*s, 10*s);
        ctx.lineTo(46*s, 16*s);
        ctx.lineTo(54*s, 32*s);
        ctx.lineTo(48*s, 52*s);
        ctx.closePath();
        ctx.fill();

        // Cracks/facets
        ctx.strokeStyle = colors.cracks || this._darken(bodyColor, 30);
        ctx.lineWidth = 1.5*s;
        ctx.beginPath();
        ctx.moveTo(32*s, 10*s);
        ctx.lineTo(28*s, 32*s);
        ctx.lineTo(16*s, 52*s);
        ctx.moveTo(28*s, 32*s);
        ctx.lineTo(48*s, 52*s);
        ctx.stroke();

        // Crystals
        ctx.fillStyle = crystalColor;
        // Top crystal
        ctx.beginPath();
        ctx.moveTo(30*s, 14*s);
        ctx.lineTo(26*s, 6*s);
        ctx.lineTo(34*s, 4*s);
        ctx.lineTo(36*s, 14*s);
        ctx.fill();
        // Side crystal
        ctx.beginPath();
        ctx.moveTo(46*s, 20*s);
        ctx.lineTo(54*s, 14*s);
        ctx.lineTo(56*s, 22*s);
        ctx.lineTo(48*s, 24*s);
        ctx.fill();

        // Eyes
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(26*s, 28*s, 3*s, 0, Math.PI*2);
        ctx.arc(38*s, 28*s, 3*s, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(27*s, 28*s, 1.5*s, 0, Math.PI*2);
        ctx.arc(39*s, 28*s, 1.5*s, 0, Math.PI*2);
        ctx.fill();

        // Arms (if present)
        if (colors.arms) {
            ctx.fillStyle = colors.arms;
            this._roundRect(ctx, 6*s, 30*s, 8*s, 4*s, 2*s);
            this._roundRect(ctx, 50*s, 30*s, 8*s, 4*s, 2*s);
        }
    },

    _addTypeDecoration(ctx, s, colors, types, id) {
        // Add type-specific visual elements
        if (types.includes('fire')) {
            const flameColor = colors.flame || '#FF4500';
            ctx.fillStyle = flameColor;
            // Small flame on head or tail
            ctx.beginPath();
            ctx.moveTo(32*s, 4*s);
            ctx.quadraticCurveTo(28*s, -2*s, 32*s, -4*s);
            ctx.quadraticCurveTo(36*s, -2*s, 32*s, 4*s);
            ctx.fill();
        }
        if (types.includes('electric')) {
            const boltColor = colors.bolts || '#FFFF00';
            ctx.fillStyle = boltColor;
            ctx.beginPath();
            ctx.moveTo(50*s, 8*s);
            ctx.lineTo(54*s, 14*s);
            ctx.lineTo(52*s, 14*s);
            ctx.lineTo(56*s, 22*s);
            ctx.lineTo(50*s, 16*s);
            ctx.lineTo(52*s, 16*s);
            ctx.closePath();
            ctx.fill();
        }
        if (types.includes('fairy')) {
            ctx.fillStyle = '#FF69B480';
            for (let i = 0; i < 4; i++) {
                const sx = (18 + i * 10) * s;
                const sy = (6 + Math.sin(i) * 4) * s;
                ctx.beginPath();
                this._drawStar(ctx, sx, sy, 2*s, 4);
                ctx.fill();
            }
        }
        if (types.includes('ghost')) {
            ctx.fillStyle = (colors.wisps || '#9370DB') + '60';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc((16 + i * 14)*s, (48 + i * 2)*s, 3*s, 0, Math.PI*2);
                ctx.fill();
            }
        }
        if (types.includes('psychic') && !types.includes('ghost')) {
            ctx.fillStyle = (colors.gem || '#FF69B4') + '80';
            ctx.beginPath();
            ctx.arc(32*s, 8*s, 3*s, 0, Math.PI*2);
            ctx.fill();
        }
    },

    _drawStar(ctx, cx, cy, r, points) {
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? r : r * 0.4;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    },

    _drawSparkles(ctx, size) {
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            this._drawStar(ctx, x, y, 3, 4);
            ctx.fill();
        }
    },

    // Draw player character
    drawPlayer(ctx, x, y, direction, frame) {
        const s = TILE_SIZE / 32;

        ctx.save();
        ctx.translate(x, y);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(16*s, 30*s, 8*s, 3*s, 0, 0, Math.PI*2);
        ctx.fill();

        const bobY = Math.sin(frame * 0.3) * 1.5;

        // Legs (walking animation)
        const legOffset = Math.sin(frame * 0.5) * 3;
        ctx.fillStyle = '#2F4F4F';
        this._roundRect(ctx, 10*s, (22+bobY)*s, 5*s, (8 + legOffset)*s, 2*s);
        this._roundRect(ctx, 17*s, (22+bobY)*s, 5*s, (8 - legOffset)*s, 2*s);

        // Shoes
        ctx.fillStyle = '#8B4513';
        this._roundRect(ctx, 9*s, (28+bobY+legOffset)*s, 6*s, 3*s, 1.5*s);
        this._roundRect(ctx, 16*s, (28+bobY-legOffset)*s, 6*s, 3*s, 1.5*s);

        // Body
        ctx.fillStyle = '#4A4A4A'; // jacket
        this._roundRect(ctx, 8*s, (10+bobY)*s, 16*s, 14*s, 4*s);

        // Backpack (visible from back/side)
        if (direction === DIR.UP || direction === DIR.LEFT) {
            ctx.fillStyle = '#DAA520';
            this._roundRect(ctx, 22*s, (12+bobY)*s, 6*s, 10*s, 3*s);
        }

        // Arms
        ctx.fillStyle = '#4A4A4A';
        const armSwing = Math.sin(frame * 0.5) * 2;
        this._roundRect(ctx, 4*s, (12+bobY+armSwing)*s, 5*s, 8*s, 2*s);
        this._roundRect(ctx, 23*s, (12+bobY-armSwing)*s, 5*s, 8*s, 2*s);

        // Head
        ctx.fillStyle = '#FFE4C4'; // skin
        this._roundRect(ctx, 9*s, (2+bobY)*s, 14*s, 12*s, 5*s);

        // Hat
        ctx.fillStyle = '#2E8B57'; // green hat
        this._roundRect(ctx, 7*s, (1+bobY)*s, 18*s, 7*s, 3*s);

        // Pokeball symbol on hat
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(16*s, (4+bobY)*s, 2.5*s, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#2E8B57';
        ctx.lineWidth = 0.8*s;
        ctx.beginPath();
        ctx.moveTo(13.5*s, (4+bobY)*s);
        ctx.lineTo(18.5*s, (4+bobY)*s);
        ctx.stroke();

        // Face details based on direction
        if (direction === DIR.DOWN || direction === DIR.RIGHT) {
            // Eyes
            ctx.fillStyle = '#2C1810';
            ctx.fillRect(12*s, (7+bobY)*s, 2.5*s, 2.5*s);
            ctx.fillRect(18*s, (7+bobY)*s, 2.5*s, 2.5*s);
            // Mouth
            ctx.fillStyle = '#CC8877';
            ctx.fillRect(14*s, (11+bobY)*s, 4*s, 1*s);
        } else if (direction === DIR.UP) {
            // Back of head - hair
            ctx.fillStyle = '#4A3728';
            this._roundRect(ctx, 10*s, (6+bobY)*s, 12*s, 6*s, 3*s);
        } else {
            // Side view
            ctx.fillStyle = '#2C1810';
            ctx.fillRect(11*s, (7+bobY)*s, 2.5*s, 2.5*s);
        }

        ctx.restore();
    },

    // Draw NPC
    drawNPC(ctx, x, y, npcType, direction, frame) {
        const s = TILE_SIZE / 32;
        ctx.save();
        ctx.translate(x, y);

        const bobY = Math.sin(frame * 0.15) * 0.5;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(16*s, 30*s, 8*s, 3*s, 0, 0, Math.PI*2);
        ctx.fill();

        const colors = this._getNPCColors(npcType);

        // Legs
        ctx.fillStyle = colors.pants;
        this._roundRect(ctx, 10*s, (22+bobY)*s, 5*s, 8*s, 2*s);
        this._roundRect(ctx, 17*s, (22+bobY)*s, 5*s, 8*s, 2*s);

        // Body
        ctx.fillStyle = colors.shirt;
        this._roundRect(ctx, 8*s, (10+bobY)*s, 16*s, 14*s, 4*s);

        // Arms
        this._roundRect(ctx, 4*s, (12+bobY)*s, 5*s, 8*s, 2*s);
        this._roundRect(ctx, 23*s, (12+bobY)*s, 5*s, 8*s, 2*s);

        // Head
        ctx.fillStyle = colors.skin;
        this._roundRect(ctx, 9*s, (2+bobY)*s, 14*s, 12*s, 5*s);

        // Hair/hat
        ctx.fillStyle = colors.hair;
        this._roundRect(ctx, 8*s, (1+bobY)*s, 16*s, 6*s, 3*s);

        // Eyes
        if (direction !== DIR.UP) {
            ctx.fillStyle = '#2C1810';
            ctx.fillRect(12*s, (7+bobY)*s, 2*s, 2*s);
            ctx.fillRect(18*s, (7+bobY)*s, 2*s, 2*s);
        }

        ctx.restore();
    },

    _getNPCColors(type) {
        const colorSets = {
            professor: { shirt: '#FFFFFF', pants: '#4A4A4A', skin: '#FFE4C4', hair: '#808080' },
            rival: { shirt: '#4169E1', pants: '#2C2C2C', skin: '#FFE4C4', hair: '#FF4500' },
            gymleader: { shirt: '#DC143C', pants: '#2C2C2C', skin: '#FFE4C4', hair: '#FFD700' },
            trainer: { shirt: '#228B22', pants: '#2F4F4F', skin: '#FFE4C4', hair: '#8B4513' },
            nurse: { shirt: '#FFB6C1', pants: '#FFFFFF', skin: '#FFE4C4', hair: '#FF69B4' },
            merchant: { shirt: '#4169E1', pants: '#2C2C2C', skin: '#FFE4C4', hair: '#2C2C2C' },
            villager: { shirt: '#DEB887', pants: '#8B7355', skin: '#FFE4C4', hair: '#A0522D' },
            elite: { shirt: '#4B0082', pants: '#2C2C2C', skin: '#FFE4C4', hair: '#C0C0C0' },
            champion: { shirt: '#FFD700', pants: '#2C2C2C', skin: '#FFE4C4', hair: '#FFFFFF' },
            eclipse: { shirt: '#2C2C2C', pants: '#1A1A1A', skin: '#FFE4C4', hair: '#4B0082' }
        };
        return colorSets[type] || colorSets.villager;
    },

    // Draw a Pokeball
    drawPokeball(ctx, x, y, size) {
        const r = size / 2;
        ctx.save();
        ctx.translate(x + r, y + r);

        // Top half (red)
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(0, 0, r, Math.PI, 0);
        ctx.fill();

        // Bottom half (white)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI);
        ctx.fill();

        // Center line
        ctx.strokeStyle = '#2C2C2C';
        ctx.lineWidth = r * 0.1;
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(r, 0);
        ctx.stroke();

        // Center button
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2C2C2C';
        ctx.lineWidth = r * 0.08;
        ctx.stroke();

        ctx.restore();
    },

    // Tile rendering
    drawTile(ctx, tileType, x, y, time, theme) {
        const T = TILE_SIZE;
        switch (tileType) {
            case TILE.GRASS:
                ctx.fillStyle = '#7EC850';
                ctx.fillRect(x, y, T, T);
                // Grass detail
                ctx.fillStyle = '#6DB840';
                ctx.fillRect(x + 4, y + 4, 3, 3);
                ctx.fillRect(x + 20, y + 18, 3, 3);
                ctx.fillRect(x + 12, y + 24, 3, 3);
                break;

            case TILE.TALL_GRASS:
                ctx.fillStyle = '#7EC850';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#4A8530';
                for (let i = 0; i < 5; i++) {
                    const gx = x + 2 + (i * 6);
                    const sway = Math.sin(time * 0.002 + i) * 2;
                    ctx.beginPath();
                    ctx.moveTo(gx, y + T);
                    ctx.lineTo(gx + sway, y + 8);
                    ctx.lineTo(gx + 3, y + T);
                    ctx.fill();
                }
                break;

            case TILE.PATH:
                ctx.fillStyle = '#D2B48C';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#C4A67A';
                ctx.fillRect(x + 8, y + 6, 4, 3);
                ctx.fillRect(x + 20, y + 20, 5, 3);
                break;

            case TILE.WATER:
                ctx.fillStyle = '#4A90D9';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#5DA0E9';
                const waveOff = Math.sin(time * 0.003 + x * 0.1) * 3;
                ctx.fillRect(x, y + 10 + waveOff, T, 4);
                ctx.fillRect(x, y + 22 + waveOff, T, 3);
                break;

            case TILE.TREE:
                ctx.fillStyle = '#7EC850';
                ctx.fillRect(x, y, T, T);
                // Trunk
                ctx.fillStyle = '#8B6914';
                ctx.fillRect(x + 12, y + 18, 8, 14);
                // Leaves
                ctx.fillStyle = '#2D7A2D';
                ctx.beginPath();
                ctx.arc(x + 16, y + 14, 14, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#3A8A3A';
                ctx.beginPath();
                ctx.arc(x + 14, y + 10, 8, 0, Math.PI * 2);
                ctx.fill();
                break;

            case TILE.BUILDING: {
                const bColors = theme && theme.building ? theme.building : { border: '#B8860B', fill: '#8B6914', window: '#87CEEB' };
                ctx.fillStyle = bColors.border;
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = bColors.fill;
                ctx.fillRect(x + 1, y + 1, T - 2, T - 2);
                // Window
                ctx.fillStyle = bColors.window || '#87CEEB';
                ctx.fillRect(x + 10, y + 8, 12, 10);
                ctx.fillStyle = '#5A5A5A';
                ctx.fillRect(x + 15.5, y + 8, 1, 10);
                ctx.fillRect(x + 10, y + 12.5, 12, 1);
                break;
            }

            case TILE.WALL:
                ctx.fillStyle = '#808080';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#696969';
                ctx.fillRect(x, y, T, 2);
                ctx.fillRect(x, y + 14, T, 2);
                ctx.fillRect(x + 8, y, 2, 14);
                ctx.fillRect(x + 22, y + 14, 2, 18);
                break;

            case TILE.DOOR:
                ctx.fillStyle = '#D2B48C';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 6, y + 4, 20, 28);
                ctx.fillStyle = '#A0522D';
                ctx.fillRect(x + 8, y + 6, 16, 24);
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(x + 20, y + 18, 2, 0, Math.PI * 2);
                ctx.fill();
                break;

            case TILE.SAND:
                ctx.fillStyle = '#F4E4BC';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#E8D4AC';
                ctx.fillRect(x + 6, y + 10, 3, 2);
                ctx.fillRect(x + 18, y + 22, 4, 2);
                break;

            case TILE.FLOWER:
                ctx.fillStyle = '#7EC850';
                ctx.fillRect(x, y, T, T);
                const flowerColors = ['#FF69B4', '#FFD700', '#FF4500', '#9370DB'];
                for (let i = 0; i < 3; i++) {
                    ctx.fillStyle = flowerColors[(x + y + i) % flowerColors.length];
                    const fx = x + 4 + (i * 10);
                    const fy = y + 8 + (i % 2) * 12;
                    ctx.beginPath();
                    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;

            case TILE.ROCK:
                ctx.fillStyle = '#7EC850';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#808080';
                ctx.beginPath();
                ctx.moveTo(x + 4, y + T);
                ctx.lineTo(x + 8, y + 8);
                ctx.lineTo(x + 24, y + 6);
                ctx.lineTo(x + 28, y + T);
                ctx.fill();
                ctx.fillStyle = '#696969';
                ctx.beginPath();
                ctx.moveTo(x + 8, y + 8);
                ctx.lineTo(x + 16, y + 12);
                ctx.lineTo(x + 24, y + 6);
                ctx.stroke();
                break;

            case TILE.BRIDGE:
                ctx.fillStyle = '#4A90D9';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#A0522D';
                ctx.fillRect(x, y + 4, T, 24);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x, y + 4, T, 2);
                ctx.fillRect(x, y + 26, T, 2);
                ctx.fillRect(x + 14, y + 4, 4, 24);
                break;

            case TILE.CAVE_FLOOR:
                ctx.fillStyle = '#5A5A5A';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#4A4A4A';
                ctx.fillRect(x + 8, y + 12, 4, 3);
                ctx.fillRect(x + 20, y + 6, 5, 3);
                break;

            case TILE.CAVE_WALL:
                ctx.fillStyle = '#3A3A3A';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#2A2A2A';
                ctx.fillRect(x, y + 8, T, 4);
                ctx.fillRect(x + 12, y, 4, T);
                break;

            case TILE.ICE:
                ctx.fillStyle = '#B0E0E6';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#E0FFFF80';
                ctx.fillRect(x + 4, y + 4, 12, 8);
                ctx.fillRect(x + 16, y + 16, 10, 10);
                break;

            case TILE.SIGN:
                ctx.fillStyle = '#D2B48C';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 13, y + 16, 6, 16);
                ctx.fillStyle = '#DEB887';
                this._roundRect(ctx, x + 6, y + 6, 20, 14, 2);
                break;

            case TILE.PC:
                ctx.fillStyle = '#FF6B6B';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#FF4444';
                ctx.fillRect(x + 4, y + 4, T - 8, T - 8);
                // Cross
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x + 12, y + 8, 8, 16);
                ctx.fillRect(x + 8, y + 12, 16, 8);
                break;

            case TILE.MART:
                ctx.fillStyle = '#4169E1';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#3058C8';
                ctx.fillRect(x + 4, y + 4, T - 8, T - 8);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '10px monospace';
                ctx.fillText('M', x + 10, y + 22);
                break;

            case TILE.GYM_FLOOR:
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(x, y, T, T);
                ctx.fillStyle = '#A8A8A8';
                ctx.fillRect(x, y, 1, T);
                ctx.fillRect(x, y, T, 1);
                // Pokeball pattern
                ctx.strokeStyle = '#88888840';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(x + 16, y + 16, 10, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + 6, y + 16);
                ctx.lineTo(x + 26, y + 16);
                ctx.stroke();
                break;

            case TILE.STAIRS_UP:
                ctx.fillStyle = '#5A5A5A';
                ctx.fillRect(x, y, T, T);
                for (let i = 0; i < 4; i++) {
                    ctx.fillStyle = i % 2 === 0 ? '#808080' : '#696969';
                    ctx.fillRect(x + 4, y + 4 + i * 6, T - 8, 6);
                }
                ctx.fillStyle = '#FFFF0060';
                ctx.beginPath();
                ctx.moveTo(x + 16, y + 4);
                ctx.lineTo(x + 10, y + 14);
                ctx.lineTo(x + 22, y + 14);
                ctx.fill();
                break;

            case TILE.STAIRS_DOWN:
                ctx.fillStyle = '#5A5A5A';
                ctx.fillRect(x, y, T, T);
                for (let i = 0; i < 4; i++) {
                    ctx.fillStyle = i % 2 === 0 ? '#696969' : '#5A5A5A';
                    ctx.fillRect(x + 4, y + 4 + i * 6, T - 8, 6);
                }
                ctx.fillStyle = '#FFFF0060';
                ctx.beginPath();
                ctx.moveTo(x + 16, y + 28);
                ctx.lineTo(x + 10, y + 18);
                ctx.lineTo(x + 22, y + 18);
                ctx.fill();
                break;

            default:
                ctx.fillStyle = '#7EC850';
                ctx.fillRect(x, y, T, T);
        }
    },

    // Helper: rounded rectangle
    _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
    },

    _lighten(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + amount);
        const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
        const b = Math.min(255, (num & 0x0000FF) + amount);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    },

    _darken(hex, amount) {
        return this._lighten(hex, -amount);
    }
};
