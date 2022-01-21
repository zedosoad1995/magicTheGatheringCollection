import {
	Entity,
	Column,
    PrimaryGeneratedColumn,
    BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Prices } from './Prices';
import { Decks } from './Decks';

// TODO: inserir nullable e default value
@Entity('cards')
export class Cards extends BaseEntity {
    @PrimaryGeneratedColumn()
	id: number;

    @Column()
    name: string;

    @Column({ type: 'date' })
    releasedAt: string;

    @Column()
    url: string;

    @Column({nullable: true})
    layout: string;

    @Column()
    type: string;

    @Column()
    colors: string[];

    // TODO: save the real image?
    @Column()
    imageUrl: string;

    @Column()
    manaCost: string;

    @Column()
    rawCost: number;

    @Column({nullable: true})
    rulesText: string;

    @Column()
    descriptionText: string;

    @Column()
    power: number;

    @Column()
    toughness: number;

    @Column()
    kaywords: string[];

    @Column()
    isReserved: boolean;

    @Column()
    hasFoil: boolean;

    @Column()
    hasNonFoil: boolean;

    @Column()
    isOversized: boolean;

    @Column()
    isPromo: boolean;

    @Column()
    isReprint: boolean;

    @Column()
    isVariation: boolean;

    @Column()
    collectorNumber: number;

    @Column()
    isDigital: number;

    @Column()
    rarity: string;

    @Column()
    artist: string;

    @Column()
    borderColor: string;

    @Column()
    frame: string;

    @Column()
    frameEffects: string;

    @Column()
    securityStamp: string;

    @Column()
    loyalty: string;

    @Column()
    isFullArt: boolean;

    @Column()
    isTextless: boolean;

    @Column()
    fromBooster: boolean;

    @Column()
    hasStorySpotlight: boolean;

    @Column()
    edhrecRank: number;

    @Column()
    uniqueScryfallId: string;

    @Column()
    cardPartNumber: number;

    @OneToOne(() => Prices)
    @JoinColumn()
    prices: Prices;
    
    @ManyToOne(
        () => Decks, 
        deck => deck.cards
    )
    deck: Decks;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}