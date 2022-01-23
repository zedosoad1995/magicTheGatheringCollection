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
    Unique,
} from 'typeorm';
import { Price } from './Price';
import { Deck } from './Deck';

// TODO: inserir nullable e default value
@Entity('card')
export class Card extends BaseEntity {
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

    @Column("text", { array: true })
    colors: string[];

    // TODO: save the real image?
    @Column({nullable: true})
    imageUrl: string;

    @Column({nullable: true})
    manaCost: string;

    @Column()
    rawCost: number;

    @Column({nullable: true})
    rulesText: string;

    @Column({nullable: true})
    descriptionText: string;

    @Column({nullable: true})
    power: string;

    @Column({nullable: true})
    toughness: string;

    @Column("text", { array: true, nullable: true })
    keywords: string[];

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

    @Column({nullable: true})
    collectorNumber: string;

    @Column()
    isDigital: boolean;

    @Column()
    rarity: string;

    @Column({nullable: true})
    artist: string;

    @Column()
    borderColor: string;

    @Column()
    frame: string;

    @Column({nullable: true})
    frameEffects: string;

    @Column({nullable: true})
    securityStamp: string;

    @Column({nullable: true})
    loyalty: string;

    @Column()
    isFullArt: boolean;

    @Column()
    isTextless: boolean;

    @Column()
    fromBooster: boolean;

    @Column({nullable: true})
    hasStorySpotlight: boolean;

    @Column({nullable: true})
    edhrecRank: number;

    @Column('uuid')
    uniqueScryfallId: string;

    @Column({nullable: true})
    cardPartNumber: number;

    @OneToOne(() => Price, {nullable: true, cascade: true, eager: true})
    @JoinColumn()
    price: Price;
    
    @ManyToOne(
        () => Deck, 
        deck => deck.cards
    )
    deck: Deck;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}