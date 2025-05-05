"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

const PROJECTS = [
  { name: "OFT", color: "amber-500" },
  { name: "Fabien", color: "blue-800" },
  { name: "Infoprofits", color: "blue-400" },
  { name: "Fitness", color: "green-500" },
  { name: "Personal Tasks", color: "orange-500" },
];

const ASSIGNEES = ["Paul", "Raya"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

export default function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [project, setProject] = useState("OFT");
  const [urgency, setUrgency] = useState("normal");
  const [assignedTo, setAssignedTo] = useState([]);
  const [taskTime, setTaskTime] = useState("");
  const [taskDuration, setTaskDuration] = useState(30);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const toggleAssignee = (name) => {
    setAssignedTo((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const toggleCompleted = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTask = () => {
    if (!taskName.trim() || !taskTime.trim()) return;
    const projectInfo = PROJECTS.find((p) => p.name === project);
    const newTask = {
      id: Date.now(),
      name: taskName,
      project: projectInfo.name,
      color: projectInfo.color,
      urgency,
      assignedTo,
      time: taskTime,
      duration: taskDuration,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    clearForm();
  };

  const clearForm = () => {
    setTaskName("");
    setProject("OFT");
    setUrgency("normal");
    setAssignedTo([]);
    setTaskTime("");
    setTaskDuration(30);
  };

  const handleSaveEdit = (id, updates) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
    setEditingTaskId(null);
  };

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'min' : ''}`;
  };

  const renderAssignees = (list) => {
    return list.map((name) => {
      const color = name === "Raya" ? "text-pink-500" : name === "Paul" ? "text-blue-500" : "";
      return <span key={name} className={`${color} font-medium`}>{name}</span>;
    }).reduce((prev, curr) => [prev, ", ", curr]);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 space-y-10 font-sans max-w-5xl mx-auto">
      {/* Logo Header with subtle background */}
      <div className="flex justify-center items-center mb-8 bg-gray-100 p-4 rounded-xl shadow">
        <Image
          src="/INFOPROFITS.png"
          alt="INFOPROFITS Logo"
          width={220}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Futuristic Task Input */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl shadow-2xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 tracking-tight text-center uppercase">
          Create a New Task
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="What's your mission?"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="bg-gray-700 text-white placeholder-gray-400"
          />
          <input
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            className="bg-gray-700 text-white rounded-xl px-4 py-2"
          />
          <Input
            type="number"
            min="5"
            max="480"
            step="5"
            value={taskDuration}
            onChange={(e) => setTaskDuration(Number(e.target.value))}
            placeholder="Duration (min)"
            className="bg-gray-700 text-white placeholder-gray-400"
          />
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="bg-gray-700 text-white rounded-xl px-4 py-2"
          >
            {PROJECTS.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="bg-gray-700 text-white rounded-xl px-4 py-2"
          >
            <option value="low">Low Urgency</option>
            <option value="normal">Normal Urgency</option>
            <option value="high">High Urgency</option>
          </select>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-300">Assign to:</p>
            <div className="flex gap-4">
              {ASSIGNEES.map((name) => (
                <label key={name} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={assignedTo.includes(name)}
                    onChange={() => toggleAssignee(name)}
                  />
                  <span className={name === "Raya" ? "text-pink-400" : name === "Paul" ? "text-blue-400" : ""}>
                    {name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <Button
          onClick={handleAddTask}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 rounded-xl shadow-lg"
        >
          Launch Task
        </Button>
      </motion.div>

      {/* Calendar View */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Today's Schedule</h2>
        <div className="grid grid-cols-1 divide-y divide-gray-200">
          {HOURS.map((hour) => (
            <div key={hour} className="py-4">
              <div className="text-gray-500 text-sm mb-2">{hour}</div>
              {tasks
                .filter((task) => task.time === hour)
                .map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-4 border-l-8 border-${task.color} rounded-2xl shadow-sm mb-2 hover:shadow-md ${task.completed ? 'bg-green-100 line-through text-green-700' : ''}`}
                  >
                    {editingTaskId === task.id ? (
                      <div className="space-y-2">
                        <Input
                          value={task.name}
                          onChange={(e) => handleSaveEdit(task.id, { name: e.target.value })}
                          placeholder="Task name"
                        />
                        <input
                          type="time"
                          value={task.time}
                          onChange={(e) => handleSaveEdit(task.id, { time: e.target.value })}
                          className="border rounded-xl px-2 py-1"
                        />
                        <Input
                          type="number"
                          min="5"
                          max="480"
                          step="5"
                          value={task.duration}
                          onChange={(e) => handleSaveEdit(task.id, { duration: Number(e.target.value) })}
                        />
                        <div className="flex justify-between">
                          <Button size="sm" onClick={() => setEditingTaskId(null)}>
                            Done
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div onClick={() => setEditingTaskId(task.id)} className="cursor-pointer">
                          <p className="font-medium text-lg">{task.name} ({formatDuration(task.duration)})</p>
                          <p className="text-sm text-gray-500">Project: {task.project}</p>
                          <p className="text-sm text-gray-500">Urgency: {task.urgency}</p>
                          <p className="text-sm text-gray-500">
                            Assigned to: {renderAssignees(task.assignedTo) || "None"}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleCompleted(task.id)}
                          className="w-5 h-5"
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
