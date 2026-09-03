"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ArrowRight,
  Check,
  Construction,
  Crown,
  Download,
  Gauge,
  HardHat,
  HelpCircle,
  Medal,
  RotateCcw,
  ShieldCheck,
  Timer,
  Tractor,
  Trophy,
  UserRound,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { CSSProperties, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { PLAYABLE_QUESTIONS, QUESTIONS_BY_LEVEL, type Question } from "./questions";

type ProjectDefinition = {
  id: string;
  name: string;
  description: string;
  parts: 6 | 8 | 10;
  difficulty: Question["level"];
  art: string;
  stages: string[];
};

const PROJECTS: ProjectDefinition[] = [
  {
    id: "casa-compacta",
    name: "Casa compacta",
    description: "Residência térrea funcional",
    parts: 6,
    difficulty: "Fácil",
    art: "/projects/casa-compacta.png",
    stages: ["Fundação", "Estrutura", "Alvenaria", "Cobertura", "Esquadrias", "Entrega"],
  },
  {
    id: "chale-sustentavel",
    name: "Chalé sustentável",
    description: "Moradia com soluções ecológicas",
    parts: 6,
    difficulty: "Fácil",
    art: "/projects/chale-sustentavel.png",
    stages: ["Base", "Estrutura", "Paredes", "Telhado", "Aberturas", "Entrega"],
  },
  {
    id: "posto-apoio",
    name: "Posto de apoio",
    description: "Pequena edificação de serviço",
    parts: 6,
    difficulty: "Fácil",
    art: "/projects/posto-apoio.png",
    stages: ["Fundação", "Pilares", "Vedações", "Cobertura", "Instalações", "Entrega"],
  },
  {
    id: "sobrado-familiar",
    name: "Sobrado familiar",
    description: "Residência com dois pavimentos",
    parts: 8,
    difficulty: "Intermediária",
    art: "/projects/sobrado-familiar.png",
    stages: ["Fundação", "Térreo", "Laje", "Superior", "Alvenaria", "Cobertura", "Esquadrias", "Entrega"],
  },
  {
    id: "escola-oficina",
    name: "Escola-oficina",
    description: "Espaço de ensino e prática",
    parts: 8,
    difficulty: "Intermediária",
    art: "/projects/escola-oficina.png",
    stages: ["Terreno", "Fundação", "Estrutura", "Salas", "Cobertura", "Instalações", "Acabamento", "Entrega"],
  },
  {
    id: "centro-comunitario",
    name: "Centro comunitário",
    description: "Projeto especial de maior porte",
    parts: 10,
    difficulty: "Difícil",
    art: "/projects/centro-comunitario.png",
    stages: ["Terreno", "Fundação", "Estrutura", "Lajes", "Paredes", "Cobertura", "Instalações", "Esquadrias", "Paisagismo", "Entrega"],
  },
];

type GameStatus = "start" | "playing" | "won" | "lost";
type Feedback = {
  type: "correct" | "wrong" | "timeout";
  message: string;
} | null;

type RankingEntry = {
  id: string;
  name: string;
  score: number;
  correct: number;
  errors: number;
  elapsed: number;
  completed: boolean;
  playedAt: string;
  projectName?: string;
  projectParts?: number;
};

const RANKING_API = "http://127.0.0.1:5174";
const QUESTION_TIME = 30;
type AudioMode = "lobby" | "game" | "panic";
type AudioBus = "music" | "ambience" | "sfx";

function shuffleQuestionOptions(question: Question): Question {
  const shuffled = question.options.map((text, index) => ({ text, correct: index === question.answer }));
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return {
    ...question,
    options: shuffled.map((option) => option.text) as Question["options"],
    answer: shuffled.findIndex((option) => option.correct),
  };
}

class GameAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private ambienceBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private ambienceTimer: ReturnType<typeof setInterval> | null = null;
  private mode: AudioMode | null = null;
  private muted = false;

  unlock() {
    if (this.context) {
      void this.context.resume();
      return;
    }
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.musicBus = this.context.createGain();
    this.ambienceBus = this.context.createGain();
    this.sfxBus = this.context.createGain();
    this.master.gain.value = this.muted ? 0 : 0.18;
    this.musicBus.gain.value = 0.44;
    this.ambienceBus.gain.value = 0.34;
    this.sfxBus.gain.value = 0.92;
    this.musicBus.connect(this.master);
    this.ambienceBus.connect(this.master);
    this.sfxBus.connect(this.master);
    this.master.connect(this.context.destination);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.context && this.master) {
      this.master.gain.setTargetAtTime(
        muted ? 0 : 0.18,
        this.context.currentTime,
        0.04,
      );
    }
  }

  private output(bus: AudioBus) {
    if (bus === "music") return this.musicBus;
    if (bus === "ambience") return this.ambienceBus;
    return this.sfxBus;
  }

  private tone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume = 0.2,
    delay = 0,
    bus: AudioBus = "sfx",
    endFrequency?: number,
  ) {
    const output = this.output(bus);
    if (!this.context || !output) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const start = this.context.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency && endFrequency > 0) {
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    }
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private noise(
    duration: number,
    volume = 0.2,
    delay = 0,
    frequency = 820,
    bus: AudioBus = "sfx",
    filterType: BiquadFilterType = "bandpass",
  ) {
    const output = this.output(bus);
    if (!this.context || !output) return;
    const frames = Math.floor(this.context.sampleRate * duration);
    const buffer = this.context.createBuffer(1, frames, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    }
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    const start = this.context.currentTime + delay;
    source.buffer = buffer;
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = 0.7;
    gain.gain.value = volume;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start(start);
  }

  private chord(notes: number[], duration: number, volume: number, delay = 0, bus: AudioBus = "music") {
    notes.forEach((note, index) => {
      this.tone(note, duration, index === 0 ? "sine" : "triangle", volume, delay, bus);
    });
  }

  private hammer(delay = 0, volume = 0.14) {
    this.noise(0.055, volume, delay, 1350, "sfx", "highpass");
    this.tone(168, 0.075, "square", volume * 0.7, delay, "sfx", 105);
  }

  private metal(delay = 0, volume = 0.1) {
    this.tone(1180, 0.16, "triangle", volume, delay, "sfx", 720);
    this.tone(1760, 0.11, "sine", volume * 0.55, delay + 0.018, "sfx", 980);
  }

  private scheduleMusic() {
    if (this.mode === "panic") {
      [0, 0.13, 0.26, 0.39, 0.52, 0.65].forEach((delay, index) => {
        this.tone(index % 2 ? 196 : 220, 0.09, "square", 0.058, delay, "music");
        this.noise(0.025, 0.045, delay + 0.065, 3100, "music", "highpass");
      });
      this.tone(740, 0.34, "sawtooth", 0.022, 0.05, "music", 980);
      return;
    }

    if (this.mode === "lobby") {
      this.chord([130.81, 164.81, 196], 2.65, 0.032);
      [261.63, 329.63, 392, 329.63].forEach((note, index) => {
        this.tone(note, 0.42, "triangle", 0.03, 0.3 + index * 0.58, "music");
      });
      return;
    }

    const melody = [261.63, 329.63, 392, 523.25, 440, 523.25, 392, 329.63];
    melody.forEach((note, index) => {
      const delay = index * 0.22;
      this.tone(note, 0.16, index % 2 ? "triangle" : "square", 0.048, delay, "music");
      if (index % 2 === 0) {
        this.tone(index % 4 === 0 ? 82.41 : 98, 0.16, "sine", 0.075, delay, "music", 56);
        this.noise(0.035, 0.048, delay + 0.11, 3600, "music", "highpass");
      }
    });
  }

  private scheduleAmbience() {
    if (this.mode === "lobby") {
      this.noise(2.8, 0.025, 0, 180, "ambience", "lowpass");
      this.hammer(0.65, 0.045);
      this.hammer(1.48, 0.038);
      this.metal(2.15, 0.032);
      return;
    }

    if (this.mode === "panic") {
      this.noise(0.7, 0.055, 0, 520, "ambience", "bandpass");
      this.hammer(0.12, 0.07);
      this.metal(0.45, 0.05);
      return;
    }

    this.tone(54, 2.2, "sawtooth", 0.018, 0, "ambience", 49);
    this.hammer(0.42, 0.048);
    this.hammer(1.34, 0.04);
    this.metal(2.08, 0.035);
  }

  startMusic(mode: AudioMode) {
    this.unlock();
    if (this.mode === mode && this.musicTimer) return;
    const previousMode = this.mode;
    this.clearLoops();
    this.mode = mode;
    if (mode === "panic" && previousMode !== "panic") this.warning();
    this.scheduleMusic();
    this.scheduleAmbience();
    this.musicTimer = setInterval(
      () => this.scheduleMusic(),
      mode === "panic" ? 780 : mode === "lobby" ? 3200 : 1760,
    );
    this.ambienceTimer = setInterval(
      () => this.scheduleAmbience(),
      mode === "panic" ? 1050 : mode === "lobby" ? 4200 : 3100,
    );
  }

  setPanic(panic: boolean) {
    this.startMusic(panic ? "panic" : "game");
  }

  private clearLoops() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    if (this.ambienceTimer) clearInterval(this.ambienceTimer);
    this.musicTimer = null;
    this.ambienceTimer = null;
  }

  stopMusic() {
    this.clearLoops();
    this.mode = null;
  }

  private warning() {
    this.tone(740, 0.18, "square", 0.075, 0, "sfx", 920);
    this.tone(920, 0.18, "square", 0.075, 0.22, "sfx", 740);
    this.tone(740, 0.18, "square", 0.075, 0.44, "sfx", 920);
  }

  interfacePress() {
    this.tone(520, 0.045, "sine", 0.055, 0, "sfx", 640);
  }

  interfaceToggle(enabled: boolean) {
    this.tone(enabled ? 520 : 360, 0.08, "triangle", 0.09, 0, "sfx", enabled ? 760 : 260);
  }

  projectSelect() {
    this.tone(392, 0.08, "triangle", 0.095, 0, "sfx");
    this.tone(587.33, 0.12, "triangle", 0.075, 0.07, "sfx");
    this.metal(0.02, 0.045);
  }

  roundStart() {
    [196, 261.63, 329.63, 523.25].forEach((note, index) => {
      this.tone(note, 0.18, "triangle", 0.095, index * 0.09, "sfx");
    });
    this.noise(0.18, 0.075, 0.18, 1600, "sfx", "highpass");
  }

  questionReady() {
    this.tone(720, 0.065, "sine", 0.055, 0, "sfx", 920);
    this.tone(1040, 0.075, "triangle", 0.04, 0.075, "sfx");
  }

  answerChosen(index: number) {
    this.tone(330 + index * 55, 0.07, "square", 0.055, 0, "sfx", 280 + index * 45);
  }

  success() {
    this.tone(523.25, 0.14, "triangle", 0.13, 0, "sfx");
    this.tone(659.25, 0.18, "triangle", 0.13, 0.12, "sfx");
    this.tone(783.99, 0.28, "triangle", 0.1, 0.27, "sfx");
    this.hammer(0.1, 0.15);
    this.hammer(0.3, 0.13);
    this.metal(0.46, 0.11);
    this.noise(0.32, 0.07, 0.38, 360, "sfx", "lowpass");
  }

  wrongDemolition() {
    this.tone(180, 0.2, "sawtooth", 0.11, 0, "sfx", 105);
    this.noise(0.18, 0.13, 0.12, 960, "sfx", "bandpass");
    this.tone(94, 0.62, "sawtooth", 0.18, 0.28, "sfx", 48);
    this.noise(0.85, 0.32, 0.38, 430, "sfx", "lowpass");
    this.metal(0.5, 0.13);
  }

  timeoutCollapse() {
    [880, 880, 660].forEach((note, index) => {
      this.tone(note, 0.12, "square", 0.1, index * 0.14, "sfx");
    });
    this.noise(0.18, 0.16, 0.38, 1250, "sfx", "highpass");
    this.noise(1, 0.3, 0.52, 260, "sfx", "lowpass");
    this.tone(76, 0.8, "sawtooth", 0.15, 0.5, "sfx", 38);
  }

  win() {
    [261.63, 329.63, 392, 523.25, 659.25, 783.99].forEach((note, index) => {
      this.tone(note, 0.32, "triangle", 0.16, index * 0.13, "sfx");
    });
    this.chord([261.63, 329.63, 392, 523.25], 0.95, 0.1, 0.78, "sfx");
    this.noise(0.7, 0.08, 0.72, 4200, "sfx", "highpass");
  }

  lose() {
    [164.81, 130.81, 98].forEach((note, index) => {
      this.tone(note, 0.42, "sawtooth", 0.11, index * 0.22, "sfx", note * 0.72);
    });
    this.noise(0.9, 0.15, 0.42, 220, "sfx", "lowpass");
  }

  navigation() {
    this.tone(620, 0.09, "triangle", 0.075, 0, "sfx", 430);
    this.tone(430, 0.09, "triangle", 0.055, 0.08, "sfx", 520);
  }

  download() {
    this.tone(880, 0.075, "sine", 0.07, 0, "sfx");
    this.tone(1174.66, 0.16, "triangle", 0.075, 0.08, "sfx");
  }
}

function ConstructionSite({
  level,
  action,
  panic,
  project,
  guideMessage,
  guideTone,
  failed,
}: {
  level: number;
  action: "build" | "demolish" | "timeout" | null;
  panic: boolean;
  project: ProjectDefinition;
  guideMessage: string;
  guideTone: "greeting" | "praise" | "support" | "urgent";
  failed: boolean;
}) {
  return (
    <section className={`construction-site project-${project.id} ${action ?? ""} ${panic ? "panic-site" : ""} ${failed ? "gameover-site" : ""}`} aria-label={`${project.name} com ${level} de ${project.parts} etapas construídas`}>
      <div className="site-sky" aria-hidden="true">
        <div className="moon" />
        <div className="cloud cloud-one" />
        <div className="cloud cloud-two" />
      </div>

      <div className="scene-label">
        <span><Construction size={15} /> {project.name}</span>
        <strong>{level === project.parts ? "CONCLUÍDA" : "EM EXECUÇÃO"}</strong>
      </div>

      <div className={`guide-overlay ${guideTone}`}>
        <img src="/characters/professora-beatriz-chibi.png" width="180" height="180" alt="Professora Beatriz, guia do jogo" />
        <div className="guide-speech">
          <strong>PROF.ª BEATRIZ</strong>
          <p>{guideMessage}</p>
        </div>
      </div>

      <div className="crane" aria-hidden="true">
        <div className="crane-mast" />
        <div className="crane-arm" />
        <div className="crane-cable" />
        <div className="crane-hook">
          <span className="wrecking-chain" />
          <span className="wrecking-ball" />
        </div>
      </div>

      <div
        className={`project-build level-${level}`}
        style={{ "--project-progress": `${(level / project.parts) * 100}%` } as CSSProperties}
        aria-hidden="true"
      >
        <div className="project-blueprint">
          <img src={project.art} alt="" />
        </div>
        <div className="project-assembly">
          {project.stages.map((stage, index) => {
            const newestStage = index === level - 1;
            return (
              <div
                className={`building-piece ${index < level ? "present" : ""} ${action === "build" && newestStage ? "arriving" : ""} ${(action === "demolish" || action === "timeout") && newestStage ? "targeted" : ""}`}
                style={{
                  bottom: `${index * (100 / project.parts)}%`,
                  height: `calc(${100 / project.parts}% + 1px)`,
                }}
                key={`${project.id}-${stage}`}
              >
                <img
                  src={project.art}
                  alt=""
                  style={{
                    height: `${project.parts * 100}%`,
                    bottom: `${index * -100}%`,
                  }}
                />
              </div>
            );
          })}
        </div>
        {level > 0 && level < project.parts && (
          <div className="construction-front" style={{ bottom: `${Math.min(82, (level / project.parts) * 78)}%` }}>
            <span />
          </div>
        )}
        {action === "build" && level > 0 && (
          <>
            <div className="assembly-rig" style={{ bottom: `${Math.min(86, (level / project.parts) * 78)}%` }}>
              <span className="assembly-cable" />
              <span className="assembly-hook" />
            </div>
            <div className="assembly-effects" style={{ bottom: `${Math.min(84, (level / project.parts) * 78)}%` }}>
              <span /><span /><span /><span /><strong>ETAPA ENCAIXADA</strong>
            </div>
          </>
        )}
        {level >= project.parts && <span className="completion-flag">PROJETO ENTREGUE</span>}
      </div>

      <div className="site-workers" aria-hidden="true">
        <span className="crew-member crew-one">
          <img src="/characters/colaboradora-capacete.png" alt="" />
          <i className="panic-mark">!</i>
        </span>
        <span className="crew-member crew-two">
          <img src="/characters/colaborador-projetos.png" alt="" />
          <i className="panic-mark">!</i>
        </span>
        <span className="crew-member crew-three">
          <img src="/characters/colaboradora-planta.png" alt="" />
          <i className="panic-mark">!</i>
        </span>
        <span className="crew-member crew-four">
          <img src="/characters/Beatriz.png" alt="Professora Beatriz" />
          <i className="panic-mark">!</i>
        </span>
      </div>
      <div className="site-machine" aria-hidden="true">
        <Tractor strokeWidth={1.7} />
        <span>APOIO</span>
      </div>
      <div className="ground" aria-hidden="true">
        <span className="ground-line line-one" />
        <span className="ground-line line-two" />
        <span className="cone cone-one" />
        <span className="cone cone-two" />
      </div>
      {failed && (
        <div className="rubble" aria-hidden="true">
          <span /><span /><span /><span /><span /><span />
        </div>
      )}

      <div className="build-progress">
        <div className="progress-copy">
          <span>EVOLUÇÃO DA OBRA</span>
          <strong>{Math.round((level / project.parts) * 100)}%</strong>
        </div>
        <div className="progress-track"><span style={{ width: `${(level / project.parts) * 100}%` }} /></div>
        <div className="stage-track" style={{ gridTemplateColumns: `repeat(${project.stages.length}, minmax(0, 1fr))` }}>
          {project.stages.map((stage, index) => (
            <div className={`stage-dot ${index < level ? "done" : ""}`} key={`${stage}-${index}`}>
              <span>{index < level ? <Check size={12} strokeWidth={3} /> : String(index + 1).padStart(2, "0")}</span>
              <small>{stage}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StartPanel({
  onStart,
  playerName,
  onPlayerNameChange,
  selectedProject,
  onProjectChange,
  ranking,
  onExportRanking,
}: {
  onStart: () => void;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  selectedProject: ProjectDefinition;
  onProjectChange: (project: ProjectDefinition) => void;
  ranking: RankingEntry[];
  onExportRanking: () => void;
}) {
  const topFive = ranking.slice(0, 5);

  return (
    <section className="start-panel panel-card">
      <div className="eyebrow"><HardHat size={17} /> MISSÃO DE ENGENHARIA</div>
      <h1>Escolha sua <span>obra.</span></h1>
      <p className="lead">Identifique-se, selecione um dos projetos e conclua todas as etapas antes que seus erros coloquem a estrutura abaixo.</p>

      <div className="mission-grid">
        <div><strong>{String(selectedProject.parts).padStart(2, "0")}</strong><span>etapas no projeto</span></div>
        <div><strong>30s</strong><span>por pergunta</span></div>
        <div><strong>{QUESTIONS_BY_LEVEL[selectedProject.difficulty].length}</strong><span>questões de nível {selectedProject.difficulty.toLowerCase()}</span></div>
      </div>

      <div className="project-selector" role="radiogroup" aria-label="Escolha o projeto">
        <div className="project-selector-title"><Construction size={16} /> ESCOLHA O PROJETO</div>
        <div className="project-options">
          {PROJECTS.map((project) => (
            <button
              type="button"
              role="radio"
              aria-checked={project.id === selectedProject.id}
              className={project.id === selectedProject.id ? "selected" : ""}
              key={project.id}
              onClick={() => onProjectChange(project)}
            >
              <span className="project-thumb"><img src={project.art} alt="" /></span>
              <span className="project-parts">{project.parts}<small>PARTES</small></span>
              <span className="project-copy">
                <strong>{project.name}</strong>
                <small>{project.description}</small>
                <em>{project.difficulty}</em>
              </span>
              <span className="project-check">{project.id === selectedProject.id ? <Check size={14} /> : ""}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rules-list">
        <div><span className="rule-icon positive"><Check size={17} /></span><p><strong>Acertou?</strong> Um novo elemento é construído.</p></div>
        <div><span className="rule-icon negative"><Construction size={17} /></span><p><strong>Errou?</strong> A bola de demolição remove a última etapa.</p></div>
        <div><span className="rule-icon warning"><Zap size={17} /></span><p><strong>Fique atento:</strong> sem construção para proteger, a partida termina.</p></div>
      </div>

      <form
        className="participant-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (playerName.trim()) onStart();
        }}
      >
        <label htmlFor="participant-name"><UserRound size={16} /> NOME DO PARTICIPANTE</label>
        <input
          id="participant-name"
          maxLength={50}
          value={playerName}
          onChange={(event) => onPlayerNameChange(event.target.value)}
          placeholder="Digite seu nome"
          autoComplete="off"
          required
        />
        <button className="primary-action" type="submit" disabled={!playerName.trim()}>
          <span>INICIAR A OBRA</span><ArrowRight size={20} />
        </button>
      </form>
      <p className="start-note"><ShieldCheck size={14} /> Dificuldade definida pelo projeto • Alternativas embaralhadas</p>

      <div className="ranking-preview">
        <div className="ranking-heading">
          <div><Trophy size={17} /><span>RANKING LOCAL</span></div>
          <button type="button" onClick={onExportRanking} disabled={!ranking.length}>
            <Download size={14} /> BAIXAR CSV
          </button>
        </div>
        {topFive.length ? (
          <ol className="ranking-list">
            {topFive.map((entry, index) => (
              <li key={entry.id}>
                <span className={`rank-number rank-${index + 1}`}>
                  {index === 0 ? <Crown size={14} /> : index + 1}
                </span>
                <span className="rank-player">
                  <strong>{entry.name}</strong>
                  <small>{entry.projectName ?? "Projeto clássico"} • {entry.completed ? "Entregue" : "Interrompido"} • {entry.errors} {entry.errors === 1 ? "erro" : "erros"}</small>
                </span>
                <strong className="rank-score">{entry.score.toLocaleString("pt-BR")}</strong>
              </li>
            ))}
          </ol>
        ) : (
          <div className="ranking-empty">O primeiro participante poderá inaugurar o ranking.</div>
        )}
      </div>
    </section>
  );
}

function QuestionPanel({
  question,
  timeLeft,
  selected,
  feedback,
  attempts,
  score,
  errors,
  onAnswer,
}: {
  question: Question;
  timeLeft: number;
  selected: number | null;
  feedback: Feedback;
  attempts: number;
  score: number;
  errors: number;
  onAnswer: (index: number) => void;
}) {
  const panic = timeLeft <= 10;
  const timerStyle = { "--timer-angle": `${(timeLeft / QUESTION_TIME) * 360}deg` } as CSSProperties;

  return (
    <section className={`question-panel panel-card ${panic && !feedback ? "panic" : ""}`}>
      <div className="question-topline">
        <div className="question-tags">
          <span>{question.category}</span>
          <span>{question.level}</span>
        </div>
        <span className="attempt-label">TENTATIVA {String(attempts + 1).padStart(2, "0")}</span>
      </div>

      <div className="timer-row">
        <div className="timer-copy">
          <span>{panic ? "O PRAZO ESTÁ ACABANDO" : "TEMPO PARA RESPONDER"}</span>
          <small>{panic ? "Decida agora!" : "Escolha uma alternativa"}</small>
        </div>
        <div className="timer-ring" style={timerStyle} aria-label={`${timeLeft} segundos restantes`}>
          <div><strong>{timeLeft}</strong><span>SEG</span></div>
        </div>
      </div>

      <div className="question-copy">
        <span className="question-index"><HelpCircle size={18} /> QUESTÃO</span>
        <h2>{question.prompt}</h2>
      </div>

      <div className="answers" role="group" aria-label="Alternativas">
        {question.options.map((option, index) => {
          const isCorrect = feedback && index === question.answer;
          const isWrong = feedback && selected === index && index !== question.answer;
          return (
            <button
              className={`answer ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
              key={`${question.id}-${index}-${option}`}
              disabled={Boolean(feedback)}
              onClick={() => onAnswer(index)}
            >
              <span className="answer-key">{String.fromCharCode(65 + index)}</span>
              <span className="answer-text">{option}</span>
              <span className="answer-state">
                {isCorrect ? <Check size={18} /> : isWrong ? <X size={18} /> : index + 1}
              </span>
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`feedback ${feedback.type}`} role="status">
          <span className="feedback-icon">
            {feedback.type === "correct" ? <Check /> : feedback.type === "timeout" ? <Timer /> : <X />}
          </span>
          <div>
            <strong>{feedback.type === "correct" ? "Etapa construída!" : feedback.type === "timeout" ? "Tempo esgotado!" : "Resposta incorreta!"}</strong>
            <p>{feedback.message}</p>
          </div>
        </div>
      )}

      <div className="question-footer">
        <span><Gauge size={15} /> {score.toLocaleString("pt-BR")} PTS</span>
        <span className={errors ? "has-errors" : ""}><Tractor size={15} /> {errors} {errors === 1 ? "DEMOLIÇÃO" : "DEMOLIÇÕES"}</span>
        <span className="keyboard-hint">TECLAS 1–4</span>
      </div>
    </section>
  );
}

function ResultPanel({
  won,
  playerName,
  project,
  placement,
  projectRanking,
  lastEntryId,
  score,
  correct,
  errors,
  elapsed,
  onRetry,
  onChooseAnother,
  onBackToStart,
}: {
  won: boolean;
  playerName: string;
  project: ProjectDefinition;
  placement: number | null;
  projectRanking: RankingEntry[];
  lastEntryId: string | null;
  score: number;
  correct: number;
  errors: number;
  elapsed: number;
  onRetry: () => void;
  onChooseAnother: () => void;
  onBackToStart: () => void;
}) {
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return (
    <section className={`result-panel panel-card ${won ? "victory" : "defeat"}`}>
      <div className="result-medal">{won ? <Medal /> : <Construction />}</div>
      <div className="eyebrow">{won ? "HABITE-SE CONCEDIDO" : "OBRA INTERROMPIDA"}</div>
      <h1>{won ? "Projeto entregue!" : "Demolição total."}</h1>
      <div className="result-player"><UserRound size={15} /> {playerName}{placement ? ` • ${placement}º lugar no ranking` : ""}</div>
      <p className="lead">
        {won
          ? `Você dominou o canteiro e concluiu as ${project.parts} etapas do projeto ${project.name}.`
          : `A última etapa do projeto ${project.name} foi removida. Revise os conceitos e retome a obra.`}
      </p>

      <div className="final-score">
        <span>PONTUAÇÃO FINAL</span>
        <strong>{score.toLocaleString("pt-BR")}</strong>
        <small>pontos</small>
      </div>

      <div className="result-stats">
        <div><span>Acertos</span><strong>{String(correct).padStart(2, "0")}</strong></div>
        <div><span>Demolições</span><strong>{String(errors).padStart(2, "0")}</strong></div>
        <div><span>Tempo</span><strong>{minutes}:{String(seconds).padStart(2, "0")}</strong></div>
      </div>

      {won && errors === 0 && <div className="perfect-badge"><ShieldCheck size={16} /> BÔNUS OBRA INTACTA +1.500</div>}

      <div className="result-actions">
        <button className="primary-action" onClick={won ? onChooseAnother : onRetry}>
          <span>{won ? "FAZER OUTRA CONSTRUÇÃO" : "TENTAR NOVAMENTE"}</span><RotateCcw size={19} />
        </button>
        <button className="secondary-action" onClick={onBackToStart}>
          <ArrowRight className="back-arrow" size={17} /> VOLTAR AO INÍCIO
        </button>
      </div>

      <div className="ranking-preview result-ranking">
        <div className="ranking-heading">
          <div><Trophy size={17} /><span>RANKING — {project.name}</span></div>
        </div>
        <ol className="ranking-list">
          {projectRanking.slice(0, 5).map((entry, index) => (
            <li className={entry.id === lastEntryId ? "current-player" : ""} key={entry.id}>
              <span className={`rank-number rank-${index + 1}`}>{index === 0 ? <Crown size={14} /> : index + 1}</span>
              <span className="rank-player"><strong>{entry.name}</strong><small>{entry.errors} {entry.errors === 1 ? "erro" : "erros"} • {entry.elapsed}s</small></span>
              <strong className="rank-score">{entry.score.toLocaleString("pt-BR")}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Home() {
  const [status, setStatus] = useState<GameStatus>("start");
  const [question, setQuestion] = useState<Question>(PLAYABLE_QUESTIONS[0]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [buildLevel, setBuildLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [action, setAction] = useState<"build" | "demolish" | "timeout" | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectDefinition>(PROJECTS[0]);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [lastPlacement, setLastPlacement] = useState<number | null>(null);
  const [lastEntryId, setLastEntryId] = useState<string | null>(null);
  const audio = useRef<GameAudio | null>(null);
  const usedQuestionIds = useRef<Set<number>>(new Set());
  const responseLocked = useRef(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const questionDeadline = useRef(0);
  const timeoutAction = useRef<() => void>(() => undefined);

  if (audio.current === null) {
    audio.current = new GameAudio();
  }

  useEffect(() => {
    fetch(`${RANKING_API}/ranking`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Ranking indisponível");
        return response.json() as Promise<RankingEntry[]>;
      })
      .then((entries) => setRanking(entries))
      .catch(() => setRanking([]));
  }, []);

  const clearScheduled = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  const drawQuestion = () => {
    const questionPool = QUESTIONS_BY_LEVEL[selectedProject.difficulty];
    let available = questionPool.filter((item) => !usedQuestionIds.current.has(item.id));
    if (available.length === 0) {
      usedQuestionIds.current.clear();
      available = questionPool;
    }
    const next = available[Math.floor(Math.random() * available.length)];
    usedQuestionIds.current.add(next.id);
    setQuestion(shuffleQuestionOptions(next));
    questionDeadline.current = Date.now() + QUESTION_TIME * 1000;
    setTimeLeft(QUESTION_TIME);
    setSelected(null);
    setFeedback(null);
    setAction(null);
    responseLocked.current = false;
    audio.current?.setPanic(false);
    audio.current?.questionReady();
  };

  const startGame = () => {
    if (!playerName.trim()) return;
    clearScheduled();
    usedQuestionIds.current.clear();
    setBuildLevel(0);
    setScore(0);
    setErrors(0);
    setCorrect(0);
    setAttempts(0);
    setElapsed(0);
    setLastPlacement(null);
    setLastEntryId(null);
    setStatus("playing");
    responseLocked.current = false;
    audio.current?.setMuted(!soundEnabled);
    audio.current?.startMusic("game");
    audio.current?.roundStart();
    drawQuestion();
  };

  const registerResult = async (
    result: "won" | "lost",
    finalScore: number,
    finalCorrect: number,
    finalErrors: number,
  ) => {
    const entry: RankingEntry = {
      id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      name: playerName.trim(),
      score: finalScore,
      correct: finalCorrect,
      errors: finalErrors,
      elapsed,
      completed: result === "won",
      playedAt: new Date().toISOString(),
      projectName: selectedProject.name,
      projectParts: selectedProject.parts,
    };
    let updated: RankingEntry[];
    try {
      const response = await fetch(`${RANKING_API}/ranking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error("Não foi possível salvar o resultado");
      updated = await response.json() as RankingEntry[];
    } catch {
      updated = [...ranking, entry]
        .sort((a, b) => b.score - a.score || a.errors - b.errors || a.elapsed - b.elapsed)
        .slice(0, 100);
    }
    setRanking(updated);
    const projectRanking = updated.filter((item) => item.projectName === selectedProject.name);
    setLastPlacement(projectRanking.findIndex((item) => item.id === entry.id) + 1);
    setLastEntryId(entry.id);
  };

  const finishGame = async (
    result: "won" | "lost",
    finalScore: number,
    finalCorrect: number,
    finalErrors: number,
  ) => {
    await registerResult(result, finalScore, finalCorrect, finalErrors);
    audio.current?.stopMusic();
    if (result === "won") audio.current?.win();
    else audio.current?.lose();
    setStatus(result);
  };

  const exportRanking = () => {
    if (!ranking.length) return;
    audio.current?.download();
    const link = document.createElement("a");
    link.href = `${RANKING_API}/ranking.csv`;
    link.click();
  };

  const submitAnswer = (index: number, timedOut = false) => {
    if (responseLocked.current || status !== "playing") return;
    responseLocked.current = true;
    setSelected(index >= 0 ? index : null);
    setAttempts((value) => value + 1);
    audio.current?.setPanic(false);
    if (!timedOut) audio.current?.answerChosen(index);

    if (!timedOut && index === question.answer) {
      const nextLevel = Math.min(selectedProject.parts, buildLevel + 1);
      const points = 1000 + timeLeft * 20;
      const finalCorrect = correct + 1;
      const scoreAfterAnswer = score + points;
      setCorrect(finalCorrect);
      setScore(scoreAfterAnswer);
      setBuildLevel(nextLevel);
      setAction("build");
      setFeedback({ type: "correct", message: `${question.explanation} +${points.toLocaleString("pt-BR")} pontos.` });
      audio.current?.success();

      const id = setTimeout(() => {
        if (nextLevel >= selectedProject.parts) {
          const finalScore = scoreAfterAnswer + (errors === 0 ? 1500 : 0);
          if (errors === 0) setScore(finalScore);
          finishGame("won", finalScore, finalCorrect, errors);
        } else {
          drawQuestion();
        }
      }, 1450);
      timeouts.current.push(id);
      return;
    }

    const nextLevel = Math.max(0, buildLevel - 1);
    const finalErrors = errors + 1;
    const scoreAfterError = Math.max(0, score - 400);
    setErrors(finalErrors);
    setScore(scoreAfterError);
    setAction(timedOut ? "timeout" : "demolish");
    setFeedback({
      type: timedOut ? "timeout" : "wrong",
      message: timedOut
        ? `${question.explanation} O prazo acabou e a última etapa cedeu.`
        : `${question.explanation} O guindaste demolirá a última etapa presente.`,
    });
    if (timedOut) audio.current?.timeoutCollapse();
    else audio.current?.wrongDemolition();

    const demolitionId = setTimeout(() => setBuildLevel(nextLevel), 680);
    const nextId = setTimeout(() => {
      if (nextLevel === 0) finishGame("lost", scoreAfterError, correct, finalErrors);
      else drawQuestion();
    }, 1750);
    timeouts.current.push(demolitionId, nextId);
  };

  useEffect(() => {
    timeoutAction.current = () => submitAnswer(-1, true);
  });

  useEffect(() => {
    if (status !== "playing" || feedback) return;
    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((questionDeadline.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0 && !responseLocked.current) timeoutAction.current();
    };
    updateTimer();
    const interval = setInterval(updateTimer, 200);
    return () => clearInterval(interval);
  }, [status, feedback, question.id]);

  useEffect(() => {
    if (status === "playing" && !feedback) audio.current?.setPanic(timeLeft <= 10);
  }, [timeLeft, status, feedback]);

  useEffect(() => {
    if (status !== "playing") return;
    const interval = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (status === "playing" && !feedback && ["1", "2", "3", "4"].includes(event.key)) {
        submitAnswer(Number(event.key) - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => () => {
    clearScheduled();
    audio.current?.stopMusic();
  }, []);

  const toggleSound = () => {
    const enabled = !soundEnabled;
    if (!enabled) audio.current?.interfaceToggle(false);
    setSoundEnabled(enabled);
    audio.current?.setMuted(!enabled);
    if (enabled) {
      if (status === "start") audio.current?.startMusic("lobby");
      if (status === "playing") audio.current?.startMusic(timeLeft <= 10 ? "panic" : "game");
      audio.current?.interfaceToggle(true);
    }
  };

  const activateLobbyAudio = () => {
    if (status === "start" && soundEnabled) audio.current?.startMusic("lobby");
  };

  const showProjectSelection = () => {
    audio.current?.navigation();
    setStatus("start");
    setBuildLevel(0);
    setAction(null);
    if (soundEnabled) audio.current?.startMusic("lobby");
  };

  const backToStart = () => {
    setPlayerName("");
    setSelectedProject(PROJECTS[0]);
    showProjectSelection();
  };

  const chooseProject = (project: ProjectDefinition) => {
    audio.current?.projectSelect();
    setSelectedProject(project);
  };

  const handleInterfacePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    activateLobbyAudio();
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest("button");
    if (!button || button.hasAttribute("disabled")) return;
    if (button.classList.contains("answer") || button.closest(".project-options")) return;
    audio.current?.interfacePress();
  };

  const completedStage = selectedProject.stages[Math.max(0, buildLevel - 1)];
  let guideMessage = playerName.trim()
    ? `Prazer, ${playerName.trim()}! Agora escolha qual construção vamos realizar.`
    : "Olá! Eu sou a professora Beatriz. Qual é o seu nome e qual construção vamos realizar?";
  let guideTone: "greeting" | "praise" | "support" | "urgent" = "greeting";

  if (status === "playing" && !feedback) {
    guideMessage = timeLeft <= 10
      ? `${playerName.trim()}, atenção! Faltam poucos segundos. Trabalhadores e máquinas estão aguardando sua decisão!`
      : `Vamos lá, ${playerName.trim()}! Pense com calma e avance no projeto ${selectedProject.name}.`;
    guideTone = timeLeft <= 10 ? "urgent" : "greeting";
  }
  if (feedback?.type === "correct") {
    guideMessage = `Excelente, ${playerName.trim()}! A etapa ${completedStage} foi concluída. Continue assim!`;
    guideTone = "praise";
  }
  if (feedback?.type === "wrong") {
    guideMessage = `Não desanime, ${playerName.trim()}. A bola de demolição atingiu a obra, mas você pode reconstruir na próxima questão.`;
    guideTone = "support";
  }
  if (feedback?.type === "timeout") {
    guideMessage = `O prazo terminou, ${playerName.trim()}, e uma parte cedeu. Respire e retome a construção na próxima questão.`;
    guideTone = "support";
  }
  if (status === "won") {
    guideMessage = `Parabéns, ${playerName.trim()}! O projeto ${selectedProject.name} foi entregue com sucesso. Tenho muito orgulho do seu trabalho!`;
    guideTone = "praise";
  }
  if (status === "lost") {
    guideMessage = `Tudo bem, ${playerName.trim()}. Grandes engenheiros também aprendem com falhas. Vamos revisar e tentar novamente?`;
    guideTone = "support";
  }

  return (
    <main className="game-shell" onPointerDown={handleInterfacePointerDown}>
      <header className="game-header">
        <div className="institution-brand">
          <img src="/branding/ucb-ead.webp" width="230" height="103" alt="Universidade Católica de Brasília — Católica EAD" />
          <div className="brand">
            <span className="brand-mark"><HardHat /></span>
            <div><strong>DESAFIO</strong><span>ESTRUTURAL</span></div>
          </div>
        </div>
        <div className="universe-brand"><img src="/branding/universo-catolica.jpeg" width="500" height="100" alt="Universo Católica" /></div>
        <div className="header-actions">
          <div className="high-score"><Trophy size={16} /><span>HI-SCORE</span><strong>{(ranking[0]?.score ?? 0).toLocaleString("pt-BR")}</strong></div>
          <button className="sound-button" onClick={toggleSound} aria-label={soundEnabled ? "Desativar som" : "Ativar som"}>
            {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
            <span>{soundEnabled ? "SOM ATIVO" : "SOM DESATIVADO"}</span>
          </button>
        </div>
      </header>

      <div className={`game-layout status-${status}`}>
        <ConstructionSite
          level={status === "won" ? selectedProject.parts : buildLevel}
          action={action}
          panic={status === "playing" && timeLeft <= 10 && !feedback}
          project={selectedProject}
          guideMessage={guideMessage}
          guideTone={guideTone}
          failed={status === "lost"}
        />

        <aside className="control-area">
          {status === "start" && (
            <StartPanel
              onStart={startGame}
              playerName={playerName}
              onPlayerNameChange={setPlayerName}
              selectedProject={selectedProject}
              onProjectChange={chooseProject}
              ranking={ranking}
              onExportRanking={exportRanking}
            />
          )}
          {status === "playing" && (
            <QuestionPanel
              question={question}
              timeLeft={timeLeft}
              selected={selected}
              feedback={feedback}
              attempts={attempts}
              score={score}
              errors={errors}
              onAnswer={submitAnswer}
            />
          )}
          {(status === "won" || status === "lost") && (
            <ResultPanel
              won={status === "won"}
              playerName={playerName}
              project={selectedProject}
              placement={lastPlacement}
              projectRanking={ranking.filter((entry) => entry.projectName === selectedProject.name)}
              lastEntryId={lastEntryId}
              score={score}
              correct={correct}
              errors={errors}
              elapsed={elapsed}
              onRetry={startGame}
              onChooseAnother={showProjectSelection}
              onBackToStart={backToStart}
            />
          )}
        </aside>
      </div>

      <footer className="game-footer">
        <span>EDUCAÇÃO &amp; ENGENHARIA</span>
        <span>Construa conhecimento. Evite o retrabalho.</span>
        <span>VERSÃO 1.0</span>
      </footer>
    </main>
  );
}
