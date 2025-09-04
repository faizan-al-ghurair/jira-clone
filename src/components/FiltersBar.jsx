import React from "react";
import { Space, Select, Switch, Tag, Collapse, Badge, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useStore } from "../store";

const priorities = ["all", "P1", "P2", "P3", "P4"];
const statuses = [
  { id: "all", name: "All" },
  { id: "todo", name: "To Do" },
  { id: "inprogress", name: "In Progress" },
  { id: "review", name: "In Review" },
  { id: "done", name: "Done" },
];
const slaStates = ["all", "ontrack", "risk", "breached"];

export default function FiltersBar() {
  const columns = useStore((s) => s.columns);
  const setColumns = useStore((s) => s.setColumns);
  const filters = useStore((s) => s.filters);
  const setFilters = useStore((s) => s.setFilters);
  const issues = useStore((s) => s.issues);
  const assignees = Array.from(new Set(issues.map((i) => i.assignee))).sort();
  const categories = Array.from(new Set(issues.map((i) => i.category))).sort();

  // Count active filters
  const activeFilters = Object.entries(filters).reduce(
    (count, [key, value]) => {
      if (key === "view") return count; // Skip view filter
      if (value !== "all" && value !== "none") return count + 1;
      return count;
    },
    0
  );

  function toggle(id) {
    setColumns(
      columns.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
  }

  // Add clear filters function
  const clearFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      assignee: "all",
      category: "all",
      sla: "all",
      sortBy: "none",
      view: filters.view, // Preserve the current view
      search: "", // Clear search if you have it
    });
  };

  const filterItems = [
    {
      key: "1",
      label: (
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space>
            <FilterOutlined />
            <span>Filters</span>
            <Badge count={activeFilters} size="small" />
          </Space>
          {activeFilters > 0 && (
            <Button
              type="link"
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // Prevent collapse toggle
                clearFilters();
              }}
              style={{ fontSize: "12px" }}
            >
              Clear All
            </Button>
          )}
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space wrap style={{ width: "100%" }}>
            <Select
              value={filters.status}
              onChange={(v) => setFilters({ status: v })}
              options={statuses.map((s) => ({ value: s.id, label: s.name }))}
              style={{ width: 150 }}
              placeholder="Status"
            />
            <Select
              value={filters.priority}
              onChange={(v) => setFilters({ priority: v })}
              options={priorities.map((p) => ({
                value: p,
                label: p === "all" ? "All Priorities" : p,
              }))}
              style={{ width: 160 }}
              placeholder="Priority"
            />
            <Select
              value={filters.assignee}
              onChange={(v) => setFilters({ assignee: v })}
              options={[
                { value: "all", label: "All Assignees" },
                ...assignees.map((a) => ({ value: a, label: a })),
              ]}
              style={{ width: 180 }}
              placeholder="Assignee"
            />
            <Select
              value={filters.category}
              onChange={(v) => setFilters({ category: v })}
              options={[
                { value: "all", label: "All Categories" },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
              style={{ width: 180 }}
              placeholder="Category"
            />
            <Select
              value={filters.sla}
              onChange={(v) => setFilters({ sla: v })}
              options={slaStates.map((s) => ({
                value: s,
                label: s === "all" ? "All SLA" : s,
              }))}
              style={{ width: 140 }}
              placeholder="SLA"
            />
            <Select
              value={filters.sortBy}
              onChange={(v) => setFilters({ sortBy: v })}
              options={[
                { value: "none", label: "No Sort" },
                { value: "priority", label: "Priority" },
                { value: "sla", label: "SLA" },
              ]}
              style={{ width: 140 }}
              placeholder="Sort By"
            />
            <Space>
              {columns.map((c) => (
                <span key={c.id}>
                  <Switch checked={c.visible} onChange={() => toggle(c.id)} />
                  <Tag>{c.name}</Tag>
                </span>
              ))}
            </Space>
          </Space>
          {activeFilters > 0 && (
            <Space wrap>
              <span style={{ fontSize: "12px", color: "#666" }}>
                Active Filters:
              </span>
              {filters.status !== "all" && (
                <Tag closable onClose={() => setFilters({ status: "all" })}>
                  Status: {statuses.find((s) => s.id === filters.status)?.name}
                </Tag>
              )}
              {filters.priority !== "all" && (
                <Tag closable onClose={() => setFilters({ priority: "all" })}>
                  Priority: {filters.priority}
                </Tag>
              )}
              {filters.assignee !== "all" && (
                <Tag closable onClose={() => setFilters({ assignee: "all" })}>
                  Assignee: {filters.assignee}
                </Tag>
              )}
              {filters.category !== "all" && (
                <Tag closable onClose={() => setFilters({ category: "all" })}>
                  Category: {filters.category}
                </Tag>
              )}
              {filters.sla !== "all" && (
                <Tag closable onClose={() => setFilters({ sla: "all" })}>
                  SLA: {filters.sla}
                </Tag>
              )}
              {filters.sortBy !== "none" && (
                <Tag closable onClose={() => setFilters({ sortBy: "none" })}>
                  Sort: {filters.sortBy}
                </Tag>
              )}
            </Space>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "8px 16px",
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Collapse
        items={filterItems}
        ghost
        bordered={false}
        expandIconPosition="end"
      />
    </div>
  );
}
