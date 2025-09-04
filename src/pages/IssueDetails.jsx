import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStore } from "../store";
import { getSLAStatus, humanizeDuration } from "../utils/sla";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tabs,
  Tag,
  Timeline,
  message,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
const priorityColor = (p) =>
  ({ P1: "red", P2: "orange", P3: "gold", P4: "green" }[p] || "default");
const slaColor = (s) =>
  ({ ontrack: "green", risk: "orange", breached: "red" }[s] || "default");
export default function IssueDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const issues = useStore((s) => s.issues);
  const updateIssue = useStore((s) => s.updateIssue);
  const addComment = useStore((s) => s.addComment);
  const issue = issues.find((i) => i.id === id);
  const [form] = Form.useForm();
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => {
    if (issue) {
      form.setFieldsValue({
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        assignee: issue.assignee,
        reporter: issue.reporter,
        category: issue.category,
        estimate: issue.estimate,
        tags: (issue.tags || []).join(", "),
      });
    }
  }, [issue]);
  if (!issue) {
    return (
      <Card style={{ margin: 16 }}>
        <Space direction="vertical">
          <div>Issue not found.</div>
          <Button onClick={() => nav(-1)}>Go Back</Button>
        </Space>
      </Card>
    );
  }
  const sla = getSLAStatus(issue.createdAt, issue.priority);
  function onSave() {
    setSaving(true);
    form
      .validateFields()
      .then((v) => {
        updateIssue(issue.id, {
          title: v.title.trim(),
          description: v.description || "",
          status: v.status,
          priority: v.priority,
          assignee: v.assignee || "Unassigned",
          reporter: v.reporter || "Unassigned",
          category: v.category,
          estimate: Number(v.estimate || 1),
          tags: v.tags
            ? v.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        });
        message.success("Issue updated");
      })
      .finally(() => setSaving(false));
  }
  function onAddComment(text) {
    if (!text.trim()) return;
    addComment(issue.id, {
      id: crypto.randomUUID?.() || String(Date.now()),
      author: "You",
      at: new Date().toISOString(),
      text: text.trim(),
    });
    message.success("Comment added");
  }
  return (
    <div
      style={{
        padding: window.innerWidth < 768 ? "8px" : "16px",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Space align="center" wrap style={{ width: "100%" }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => nav(-1)}>
            Back
          </Button>
          <Breadcrumb
            items={[
              { title: <Link to="/">Projects</Link> },
              { title: issue.key },
            ]}
          />
        </Space>

        <Row gutter={[12, 12]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space wrap>
                  <span>{issue.key}</span>
                  <span>—</span>
                  <span style={{ wordBreak: "break-word" }}>{issue.title}</span>
                  <Tag color={priorityColor(issue.priority)}>
                    {issue.priority}
                  </Tag>
                </Space>
              }
              extra={
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={saving}
                  onClick={onSave}
                >
                  {window.innerWidth > 768 ? "Save" : ""}
                </Button>
              }
              bodyStyle={{ padding: window.innerWidth < 768 ? "12px" : "24px" }}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <Input.TextArea
                    rows={4}
                    placeholder="Describe the issue..."
                  />
                </Form.Item>

                <Tabs
                  items={[
                    {
                      key: "activity",
                      label: "Activity",
                      children: (
                        <Timeline
                          items={[
                            { children: `${issue.key} created` },
                            { children: `Status: ${issue.status}` },
                            { children: `Priority: ${issue.priority}` },
                          ]}
                        />
                      ),
                    },
                    {
                      key: "comments",
                      label: `Comments (${issue.comments?.length || 0})`,
                      children: (
                        <Space direction="vertical" style={{ width: "100%" }}>
                          {(issue.comments || []).map((c) => (
                            <Card
                              key={c.id}
                              size="small"
                              style={{ width: "100%" }}
                            >
                              <div style={{ wordBreak: "break-word" }}>
                                <b>{c.author}</b> —
                                <span style={{ opacity: 0.7 }}>
                                  {new Date(c.at).toLocaleString()}
                                </span>
                                <div style={{ marginTop: 6 }}>{c.text}</div>
                              </div>
                            </Card>
                          ))}
                          <Input.TextArea
                            rows={3}
                            maxLength={1000}
                            showCount
                            placeholder="Add a comment"
                            style={{ width: "100%" }}
                            onPressEnter={(e) => {
                              if (!e.shiftKey) {
                                e.preventDefault();
                                onAddComment(e.currentTarget.value);
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                          <Button
                            block
                            onClick={(e) => {
                              const el =
                                e.currentTarget.parentElement.querySelector(
                                  "textarea"
                                );
                              if (el) {
                                onAddComment(el.value);
                                el.value = "";
                              }
                            }}
                          >
                            Add Comment
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  style={{ width: "100%" }}
                />
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title="Details"
              bodyStyle={{ padding: window.innerWidth < 768 ? "12px" : "24px" }}
            >
              <Form form={form} layout="vertical">
                <Row gutter={[8, 0]}>
                  <Col xs={12} sm={24}>
                    <Form.Item label="Status" name="status">
                      <Select
                        options={[
                          { value: "todo", label: "To Do" },
                          { value: "inprogress", label: "In Progress" },
                          { value: "review", label: "In Review" },
                          { value: "done", label: "Done" },
                        ]}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={24}>
                    <Form.Item label="Priority" name="priority">
                      <Select
                        options={[
                          { value: "P1" },
                          { value: "P2" },
                          { value: "P3" },
                          { value: "P4" },
                        ]}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Assignee" name="assignee">
                  <Input />
                </Form.Item>
                <Form.Item label="Reporter" name="reporter">
                  <Input />
                </Form.Item>
                <Form.Item label="Category" name="category">
                  <Select
                    options={[
                      { value: "Task" },
                      { value: "Story" },
                      { value: "Bug" },
                      { value: "Epic" },
                    ]}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item label="Estimate (hours)" name="estimate">
                  <Input />
                </Form.Item>
                <Form.Item label="Tags (comma separated)" name="tags">
                  <Input />
                </Form.Item>
              </Form>

              <Card size="small" style={{ marginTop: 12 }} title="SLA">
                <Space wrap>
                  <Tag color={slaColor(sla.status)}>
                    {sla.status.toUpperCase()}
                  </Tag>
                  <span>
                    {humanizeDuration(sla.remainingMs)}{" "}
                    {sla.remainingMs < 0 ? "overdue" : "left"}
                  </span>
                </Space>
              </Card>

              <Descriptions
                size="small"
                column={1}
                style={{ marginTop: 12 }}
                layout={window.innerWidth < 768 ? "vertical" : "horizontal"}
              >
                <Descriptions.Item label="Created">
                  {new Date(issue.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated">
                  {new Date(issue.updatedAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
