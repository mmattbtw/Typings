export abstract class BitField<T extends string> extends Set<T> {
	constructor(protected bitfield: bigint) {
		super();
	}

	patch(sum: bigint): this {
		this.bitfield = BigInt(sum);

		for (const k of this.flagKeys) {
			this.has(k) ? this.add(k) : this.remove(k);
		}

		return this;
	}

	has(value: T): boolean {
		if (!this.flags[value]) throw new Error(`Unknown flag ${value}`);

		return (this.bitfield & this.flags[value]) === this.flags[value];
	}

	/**
	 * Add one or many values to sum
	 */
	add(value: T | Array<T>): this {
		let total = BigInt(0);
		const arr = value instanceof Array ? [...value] : [value];
		for (const v of arr) {
			const f = this.flags[v];
			if (!f) continue;

			super.add(<T>v.toString());
			total |= f;
		}

		this.bitfield |= total;
		return this;
	}

	/**
	 * Remove one or many values from the sum
	 */
	remove(value: T | Array<T>): this {
		let total = BigInt(0);
		const arr = value instanceof Array ? [...value] : [value];
		for (const v of arr) {
			const f = this.flags[v];
			if (!f) continue;

			super.delete(<T>v.toString());
			total |= f;
		}

		this.bitfield &= ~total;
		return this;
	}

	/**
	 * Clear all items in this bit set
	 */
	clear(): void {
		this.bitfield = BigInt(0);
		return super.clear();
	}

	serialize(): BitField.Serialized<T> {
		const o = <BitField.Serialized<T>>{};
		for (const k of this.flagKeys) {
			const f = this.flags[k];
			if (!f) throw new Error(`Unknown flag ${f}`);

			this.has(f as any) ? (o as any)[k as T] = true : (o as any)[k as T] = false;
		}

		o._bitfield = this.bitfield;
		return o;
	}

	/**
	 * Return the numeric bit set of the flags
	 */
	resolve(): bigint {
		return this.bitfield;
	}

	/**
	 * Return an array containing the flags as defined
	 */
	resolveNative(): T[] {
		const flags = <T[]>[];
		for (const f of this.values()) flags.push(f);

		return flags;
	}

	/**
	 * Return a bit set combining all flags
	 */
	all(): bigint {
		let total = 0;
		for (const v of this.flagKeys) {
			const f = this.flags[v];
			if (!f) throw new Error(`Unknown flag ${f }`);

			total |= f;
		}

		return BigInt(total);
	}

	get flagKeys(): T[] {
		return <T[]><unknown>Object.keys(this.flags).map(key => this.flags[key as unknown as T]).filter(value => typeof value === 'string');
	}

	abstract get flags(): BitField.Flags<T>;
}

const noop = () => { };

export namespace BitField {
	export type Flags<T extends string> = { [key in T]: bigint; };
	export type Serialized<T extends string> = WithInternalBitField<T> & BoolMap<T>;

	export interface WithInternalBitField<T> {
		_bitfield: bigint;
	}
	type BoolMap<T extends string> = {
		[key in T]: boolean;
	};
}
