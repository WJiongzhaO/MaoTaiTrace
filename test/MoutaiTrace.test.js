import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { anyValue } from "@nomicfoundation/hardhat-viem-assertions/predicates";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("MoutaiTrace", async function () {
  const { viem } = await network.create();

  it("部署合约", async function () {
    const moutaiTrace = await viem.deployContract("MoutaiTrace");

    assert.ok(moutaiTrace.address);
  });

  it("添加记录后可以按批次号查询记录", async function () {
    const [operator] = await viem.getWalletClients();
    const moutaiTrace = await viem.deployContract("MoutaiTrace");

    await moutaiTrace.write.addRecord([
      "MT202605060001",
      "灌装",
      "贵州茅台酒 53 度 500ml，灌装质检合格",
    ]);

    const records = await moutaiTrace.read.getRecords(["MT202605060001"]);

    assert.equal(records.length, 1);
    assert.equal(records[0].stage, "灌装");
    assert.equal(records[0].operator.toLowerCase(), operator.account.address.toLowerCase());
    assert.equal(records[0].details, "贵州茅台酒 53 度 500ml，灌装质检合格");
    assert.ok(records[0].timestamp > 0n);
  });

  it("添加记录时会触发 TraceAdded 事件", async function () {
    const [operator] = await viem.getWalletClients();
    const moutaiTrace = await viem.deployContract("MoutaiTrace");

    await viem.assertions.emitWithArgs(
      moutaiTrace.write.addRecord([
        "MT202605060002",
        "入库",
        "仁怀仓库 A 区入库完成",
      ]),
      moutaiTrace,
      "TraceAdded",
      [
        "MT202605060002",
        "入库",
        getAddress(operator.account.address),
        anyValue,
        "仁怀仓库 A 区入库完成",
      ],
    );
  });

  it("空批次号会 revert", async function () {
    const moutaiTrace = await viem.deployContract("MoutaiTrace");

    await assert.rejects(
      moutaiTrace.write.addRecord(["", "物流", "批次号为空时不允许写入"]),
      /batchId cannot be empty/,
    );
  });
});
