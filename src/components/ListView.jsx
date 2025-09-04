import React from "react";
import { Card, Row, Col, Statistic, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { filteredIssues } from "../utils/filtering";
import { getSLAStatus, humanizeDuration } from "../utils/sla";

export default function ListView() {
  const issues = useStore((s) => s.issues);
  const filters = useStore((s) => s.filters);
  const nav = useNavigate();
  const data = filteredIssues(issues, filters);
  const breached = data.filter(
    (i) => getSLAStatus(i.createdAt, i.priority).status === "breached"
  ).length;
  const risk = data.filter(
    (i) => getSLAStatus(i.createdAt, i.priority).status === "risk"
  ).length;
  const p1 = data.filter((i) => i.priority === "P1").length;

  const isMobile = window.innerWidth < 768;

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      fixed: "left",
      width: 100,
    },
    {
      title: "Title",
      dataIndex: "title",
      ellipsis: true,
      width: isMobile ? 150 : "auto",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: isMobile ? 100 : 120,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      width: 100,
      render: (p) => (
        <Tag color={{ P1: "red", P2: "orange", P3: "gold", P4: "green" }[p]}>
          {p}
        </Tag>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      responsive: ["md"],
    },
    {
      title: "Category",
      dataIndex: "category",
      responsive: ["lg"],
    },
    {
      title: "SLA",
      width: 150,
      render: (_, r) => {
        const s = getSLAStatus(r.createdAt, r.priority);
        return (
          <Tag
            color={
              { ontrack: "green", risk: "orange", breached: "red" }[s.status]
            }
          >
            {humanizeDuration(s.remainingMs)}{" "}
            {s.remainingMs < 0 ? "overdue" : "left"}
          </Tag>
        );
      },
    },
  ];

  return (
    <div
      style={{
        padding: isMobile ? "8px" : "16px",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} md={6}>
          <Card bodyStyle={{ padding: isMobile ? "12px" : "24px" }}>
            <Statistic title="Total" value={data.length} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card bodyStyle={{ padding: isMobile ? "12px" : "24px" }}>
            <Statistic title="P1" value={p1} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card bodyStyle={{ padding: isMobile ? "12px" : "24px" }}>
            <Statistic title="Breached" value={breached} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card bodyStyle={{ padding: isMobile ? "12px" : "24px" }}>
            <Statistic title="At Risk" value={risk} />
          </Card>
        </Col>
      </Row>

      <Card
        style={{ marginTop: 12 }}
        bodyStyle={{ padding: isMobile ? "8px" : "24px" }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          onRow={(r) => ({
            onClick: () => nav(`/issue/${r.id}`),
            style: { cursor: "pointer" },
          })}
          pagination={{
            pageSize: isMobile ? 5 : 8,
            size: isMobile ? "small" : "default",
          }}
          scroll={{ x: "max-content" }}
          size={isMobile ? "small" : "middle"}
        />
      </Card>
    </div>
  );
}
