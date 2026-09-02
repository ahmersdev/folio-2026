// Verlet cloth/string primitives, ported from the reference implementation's
// stage-strings.js (marinabudarina/chimes). Plain classes mutated in place
// every frame — matches the imperative, ref-driven style this codebase's
// other canvas/physics pieces use rather than reallocating per frame.

export class Vec2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  reset(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    return this;
  }

  add(v: Vec2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subtract(v: Vec2) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  subtractNew(v: Vec2) {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  get lengthSquared() {
    return this.x ** 2 + this.y ** 2;
  }

  get length() {
    return Math.hypot(this.x, this.y);
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }
}

export type TParticleOptions = {
  x: number;
  y: number;
  pinned: boolean;
  id: number;
  char: string;
};

export class Particle {
  pos: Vec2;
  oldPos: Vec2;
  acceleration: Vec2;
  pinned: boolean;
  id: number;
  char: string;
  // Grabbed particles are pinned for the duration of the drag; this
  // remembers whatever pinned state they had before the grab (only row 0 is
  // pinned by the grid setup) so releasing them restores the right physics.
  originalPinnedState: boolean;
  // The vertical ("string") constraint running from this particle down to
  // the next row — set once during grid construction, read every frame to
  // angle the glyph draw to its local string-segment tilt.
  downConstraint: Constraint | null = null;

  constructor({ x, y, pinned, id, char }: TParticleOptions) {
    this.pos = new Vec2(x, y);
    this.oldPos = new Vec2(x, y);
    this.acceleration = new Vec2();
    this.pinned = pinned;
    this.id = id;
    this.char = char;
    this.originalPinnedState = pinned;
  }

  applyForce(v: Vec2) {
    this.acceleration.add(v);
  }

  update(dtSquared: number, gravity: number, damping: number) {
    if (this.pinned) {
      this.acceleration.reset();
      return;
    }

    const velocityX = (this.pos.x - this.oldPos.x) * damping;
    const velocityY = (this.pos.y - this.oldPos.y) * damping;
    this.oldPos.reset(this.pos.x, this.pos.y);

    this.applyForce(new Vec2(0, gravity / dtSquared));

    this.pos.x += velocityX + this.acceleration.x * dtSquared;
    this.pos.y += velocityY + this.acceleration.y * dtSquared;
    this.acceleration.reset();
  }
}

export type TConstraintOptions = {
  p1: Particle;
  p2: Particle;
  length: number;
  compressFactor: number;
  stretchFactor: number;
};

export class Constraint {
  p1: Particle;
  p2: Particle;
  length: number;
  minLength: number;
  maxLength: number;

  constructor({
    p1,
    p2,
    length,
    compressFactor,
    stretchFactor,
  }: TConstraintOptions) {
    this.p1 = p1;
    this.p2 = p2;
    this.length = length;
    this.minLength = length * compressFactor;
    this.maxLength = length * stretchFactor;
  }

  // Slack constraint, not a rigid rod: only corrects positions once the
  // distance strays outside [minLength, maxLength], and even then only pulls
  // it back to that boundary rather than the rest length — this is what
  // lets strings sway loosely instead of snapping taut.
  solve() {
    const dx = this.p2.pos.x - this.p1.pos.x;
    const dy = this.p2.pos.y - this.p1.pos.y;
    const distance = Math.hypot(dx, dy) || 0.0001;

    let targetLength = this.length;
    if (distance < this.minLength) targetLength = this.minLength;
    else if (distance > this.maxLength) targetLength = this.maxLength;
    else return;

    const percent = (targetLength - distance) / distance / 2;
    const offsetX = dx * percent;
    const offsetY = dy * percent;

    if (!this.p1.pinned) {
      this.p1.pos.x -= offsetX;
      this.p1.pos.y -= offsetY;
    }
    if (!this.p2.pinned) {
      this.p2.pos.x += offsetX;
      this.p2.pos.y += offsetY;
    }
  }
}
