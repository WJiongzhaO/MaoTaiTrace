// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MoutaiTrace
 * @dev 茅台酒批次溯源 Demo 合约。
 *
 * 设计目标：
 * 1. 以批次号 batchId 作为索引，保存该批次在生产、仓储、物流、销售等环节的溯源记录。
 * 2. 每条记录保存环节名称、操作人地址、上链时间和详细说明。
 * 3. Demo 阶段只做最基础的数据上链和查询，不引入复杂角色权限。
 */
contract MoutaiTrace {
    /**
     * @dev 单条溯源记录。
     * @param stage 当前溯源环节，例如“制曲”“发酵”“灌装”“入库”“物流”“销售”。
     * @param operator 提交该条记录的钱包地址，用于标识链上操作人。
     * @param timestamp 记录写入区块链时的区块时间戳。
     * @param details 当前环节的补充说明，例如质检结果、仓库位置、物流单号等。
     */
    struct Record {
        string stage;
        address operator;
        uint256 timestamp;
        string details;
    }

    /**
     * @dev 批次号到溯源记录数组的映射。
     *
     * Solidity 会为 public mapping 自动生成 getter。
     * 由于 value 是动态数组，自动 getter 需要传入 batchId 和数组下标。
     * 为了便于一次性读取完整记录，本合约额外提供 getRecords 函数。
     */
    mapping(string => Record[]) public traces;

    /**
     * @dev 新增溯源记录事件。
     * @param batchId 茅台酒批次号。
     * @param stage 当前溯源环节。
     * @param operator 提交记录的钱包地址。
     * @param timestamp 记录上链时间。
     * @param details 当前环节详情。
     */
    event TraceAdded(
        string batchId,
        string stage,
        address indexed operator,
        uint256 timestamp,
        string details
    );

    /**
     * @notice 为指定批次新增一条溯源记录。
     * @dev Demo 版本只校验批次号不能为空；操作人直接使用 msg.sender 记录。
     * @param batchId 茅台酒批次号，不能为空。
     * @param stage 当前溯源环节。
     * @param details 当前环节详情。
     */
    function addRecord(
        string calldata batchId,
        string calldata stage,
        string calldata details
    ) external {
        require(bytes(batchId).length > 0, "batchId cannot be empty");

        Record memory record = Record({
            stage: stage,
            operator: msg.sender,
            timestamp: block.timestamp,
            details: details
        });

        traces[batchId].push(record);

        emit TraceAdded(
            batchId,
            stage,
            msg.sender,
            block.timestamp,
            details
        );
    }

    /**
     * @notice 查询指定批次的完整溯源记录。
     * @param batchId 茅台酒批次号。
     * @return 指定批次下的所有溯源记录，按写入顺序返回。
     */
    function getRecords(
        string calldata batchId
    ) external view returns (Record[] memory) {
        return traces[batchId];
    }
}
