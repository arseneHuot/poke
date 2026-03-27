// ============================================================
// POKEMON NOVARA - Audio System (Web Audio API procedural music)
// ============================================================

const AudioSystem = {
    ctx: null,
    currentTrack: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    isPlaying: false,
    _loopTimer: null,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.ctx.destination);

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = 0.4;
            this.musicGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.5;
            this.sfxGain.connect(this.masterGain);
        } catch (e) {
            console.warn('Audio not available');
        }
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playMusic(trackName) {
        if (!this.ctx) return;
        if (this.currentTrack === trackName) return;
        this.stopMusic();
        this.currentTrack = trackName;
        this.isPlaying = true;
        this._playTrack(trackName);
    },

    stopMusic() {
        this.isPlaying = false;
        this.currentTrack = null;
        if (this._loopTimer) {
            clearTimeout(this._loopTimer);
            this._loopTimer = null;
        }
    },

    _playTrack(name) {
        if (!this.isPlaying || this.currentTrack !== name) return;

        const tracks = {
            town: () => this._playMelody([
                { note: 'C4', dur: 0.3 }, { note: 'E4', dur: 0.3 }, { note: 'G4', dur: 0.3 },
                { note: 'E4', dur: 0.3 }, { note: 'F4', dur: 0.3 }, { note: 'A4', dur: 0.3 },
                { note: 'G4', dur: 0.6 }, { note: 'E4', dur: 0.3 }, { note: 'D4', dur: 0.3 },
                { note: 'C4', dur: 0.6 },
            ], 'triangle', 0.15),
            route: () => this._playMelody([
                { note: 'E4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'A4', dur: 0.25 },
                { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'G4', dur: 0.25 },
                { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.25 }, { note: 'E4', dur: 0.25 },
                { note: 'G4', dur: 0.5 },
            ], 'square', 0.1),
            city: () => this._playMelody([
                { note: 'C4', dur: 0.2 }, { note: 'D4', dur: 0.2 }, { note: 'E4', dur: 0.2 },
                { note: 'G4', dur: 0.4 }, { note: 'A4', dur: 0.2 }, { note: 'G4', dur: 0.2 },
                { note: 'E4', dur: 0.4 }, { note: 'D4', dur: 0.2 }, { note: 'C4', dur: 0.2 },
                { note: 'D4', dur: 0.4 },
            ], 'triangle', 0.12),
            battle: () => this._playMelody([
                { note: 'E3', dur: 0.15 }, { note: 'E3', dur: 0.15 }, { note: 'E4', dur: 0.15 },
                { note: 'E3', dur: 0.15 }, { note: 'D4', dur: 0.15 }, { note: 'E3', dur: 0.15 },
                { note: 'C4', dur: 0.15 }, { note: 'E3', dur: 0.15 }, { note: 'B3', dur: 0.3 },
                { note: 'C4', dur: 0.3 }, { note: 'E4', dur: 0.3 },
            ], 'sawtooth', 0.08),
            cave: () => this._playMelody([
                { note: 'A2', dur: 0.5 }, { note: 'C3', dur: 0.5 }, { note: 'E3', dur: 0.5 },
                { note: 'A2', dur: 0.5 }, { note: 'B2', dur: 0.5 }, { note: 'D3', dur: 0.5 },
            ], 'sine', 0.1),
            indoor: () => this._playMelody([
                { note: 'C4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'G4', dur: 0.4 },
                { note: 'C5', dur: 0.8 },
            ], 'sine', 0.08),
            league: () => this._playMelody([
                { note: 'D4', dur: 0.2 }, { note: 'F4', dur: 0.2 }, { note: 'A4', dur: 0.2 },
                { note: 'D5', dur: 0.4 }, { note: 'C5', dur: 0.2 }, { note: 'A4', dur: 0.2 },
                { note: 'F4', dur: 0.4 }, { note: 'E4', dur: 0.2 }, { note: 'D4', dur: 0.2 },
                { note: 'F4', dur: 0.4 },
            ], 'square', 0.1),
        };

        const track = tracks[name] || tracks.town;
        const duration = track();

        this._loopTimer = setTimeout(() => {
            this._playTrack(name);
        }, duration * 1000 + 500);
    },

    _noteToFreq(note) {
        const notes = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
        const letter = note[0];
        const octave = parseInt(note[note.length - 1]);
        const sharp = note.includes('#') ? 1 : 0;
        const midi = 12 + (octave * 12) + notes[letter] + sharp;
        return 440 * Math.pow(2, (midi - 69) / 12);
    },

    _playMelody(notes, waveType, volume) {
        if (!this.ctx) return 0;
        let time = this.ctx.currentTime;
        let totalDuration = 0;

        notes.forEach(({ note, dur }) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = waveType;
            osc.frequency.value = this._noteToFreq(note);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(volume, time + 0.02);
            gain.gain.setValueAtTime(volume, time + dur - 0.05);
            gain.gain.linearRampToValueAtTime(0, time + dur);

            osc.connect(gain);
            gain.connect(this.musicGain);

            osc.start(time);
            osc.stop(time + dur);

            time += dur;
            totalDuration += dur;
        });

        return totalDuration;
    },

    // Sound effects
    playSfx(name) {
        if (!this.ctx) return;
        this.resume();

        const sfx = {
            select: () => this._beep(800, 0.08, 'square', 0.15),
            confirm: () => { this._beep(600, 0.08, 'square', 0.12); setTimeout(() => this._beep(800, 0.1, 'square', 0.12), 80); },
            cancel: () => this._beep(400, 0.1, 'square', 0.1),
            hit: () => this._noise(0.1, 0.2),
            critical: () => { this._noise(0.08, 0.2); setTimeout(() => this._beep(1200, 0.15, 'sawtooth', 0.1), 80); },
            levelup: () => {
                [523, 659, 784, 1047].forEach((f, i) => {
                    setTimeout(() => this._beep(f, 0.15, 'square', 0.1), i * 120);
                });
            },
            catch_shake: () => this._beep(300, 0.2, 'sine', 0.1),
            catch_success: () => {
                [523, 659, 784, 1047, 1319].forEach((f, i) => {
                    setTimeout(() => this._beep(f, 0.12, 'triangle', 0.12), i * 100);
                });
            },
            catch_fail: () => { this._beep(400, 0.15, 'square', 0.1); setTimeout(() => this._beep(300, 0.2, 'square', 0.1), 150); },
            heal: () => {
                [440, 554, 659, 880].forEach((f, i) => {
                    setTimeout(() => this._beep(f, 0.2, 'sine', 0.1), i * 150);
                });
            },
            evolve: () => {
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => this._beep(400 + i * 100, 0.15, 'triangle', 0.08), i * 100);
                }
            },
            bump: () => this._beep(200, 0.08, 'square', 0.08),
            door: () => { this._beep(300, 0.06, 'sine', 0.1); setTimeout(() => this._beep(400, 0.06, 'sine', 0.1), 60); },
            badge: () => {
                [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => {
                    setTimeout(() => this._beep(f, 0.2, 'triangle', 0.1), i * 120);
                });
            },
            encounter: () => {
                this._beep(600, 0.08, 'square', 0.15);
                setTimeout(() => this._beep(800, 0.08, 'square', 0.15), 100);
                setTimeout(() => this._beep(1000, 0.15, 'square', 0.15), 200);
            },
            run: () => {
                for (let i = 3; i >= 0; i--) {
                    setTimeout(() => this._beep(300 + i * 100, 0.06, 'square', 0.08), (3-i) * 50);
                }
            },
            damage: () => this._beep(200, 0.15, 'sawtooth', 0.1),
            not_effective: () => this._beep(300, 0.2, 'sine', 0.08),
            super_effective: () => {
                this._beep(600, 0.1, 'square', 0.12);
                setTimeout(() => this._beep(900, 0.15, 'square', 0.12), 100);
            },
            faint: () => {
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => this._beep(600 - i * 80, 0.12, 'square', 0.08), i * 100);
                }
            },
        };

        const fn = sfx[name];
        if (fn) fn();
    },

    _beep(freq, duration, type, volume) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume || 0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    },

    _noise(duration, volume) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(this.sfxGain);
        source.start();
    },

    setMusicVolume(vol) {
        if (this.musicGain) this.musicGain.gain.value = vol;
    },

    setSfxVolume(vol) {
        if (this.sfxGain) this.sfxGain.gain.value = vol;
    }
};
