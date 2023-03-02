import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Calculator } from "../target/types/calculator";
const { SystemProgram } = anchor.web3
import { expect } from 'chai';

describe("calculator", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  //Referencing the program - Abstraction that allows us to call methods of our SOL program.
  const program = anchor.workspace.Calculator as Program<Calculator>;
  const programProvider = program.provider as anchor.AnchorProvider;

  //Generating a keypair for our Calculator account
  const calculatorPair = anchor.web3.Keypair.generate();

  const text = "Winter School Of Solana"

  it("Creating Calculator Instance", async () => {
    //Calling create instance - Set our calculator keypair as a signer
    await program.methods.create(text).accounts(
      {
          calculator: calculatorPair.publicKey,
          user: programProvider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
      }
  ).signers([calculatorPair]).rpc()

  //We fetch the account and read if the string is actually in the account
  const account = await program.account.calculator.fetch(calculatorPair.publicKey)
  expect(account.greeting).to.eql(text)
  });

  it('Addition',async () => {
    await program.methods.add(new anchor.BN(2), new anchor.BN(3))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(5))
  })

  it('Subtraction', async () => {
    await program.methods.subtract(new anchor.BN(5), new anchor.BN(2))
      .accounts({ calculator: calculatorPair.publicKey })
      .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(3))
  })

  it('Multiplication', async () => {
    await program.methods.multiply(new anchor.BN(3), new anchor.BN(5))
      .accounts({ calculator: calculatorPair.publicKey })
      .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(15))
  })

  it('Division', async () => {
    await program.methods.divide(new anchor.BN(9), new anchor.BN(3))
      .accounts({ calculator: calculatorPair.publicKey })
      .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(3))
  })
});
