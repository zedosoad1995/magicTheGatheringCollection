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
import { Deck } from './Deck';
import { Price } from './Price';

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

    @Column({nullable: true, type: "float"})
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
    
    @ManyToOne(
        () => Deck, 
        deck => deck.cards
    )
    deck: Deck;

    @ManyToOne(
        () => Price, 
        price => price.cards,
        {nullable: false, cascade: true, eager: true}
    )
    price: Price;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updated_at: Date;
}