import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('imoveis')
export class Imovel {
  @PrimaryColumn({ name: 'numero_imovel', type: 'bigint' })
  numeroImovel: string;

  @Column({ length: 5 })
  uf: string;

  @Column({ length: 100 })
  cidade: string;

  @Column({ length: 150 })
  bairro: string;

  @Column({ length: 300 })
  endereco: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  preco: number;

  @Column({ name: 'valor_avaliacao', type: 'decimal', precision: 15, scale: 2 })
  valorAvaliacao: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  desconto: number;

  @Column({ default: false })
  financiamento: boolean;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ name: 'modalidade_venda', length: 100 })
  modalidadeVenda: string;

  @Column({ length: 500 })
  link: string;

  @Column({ name: 'data_geracao', type: 'date' })
  dataGeracao: Date;

  @Column({ length: 20, default: 'disponivel' })
  situacao: string;

  @Column({ name: 'data_situacao', type: 'timestamptz', nullable: true })
  dataSituacao: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
