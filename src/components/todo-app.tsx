import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PencilIcon, TrashIcon } from "lucide-react"
import { format } from "date-fns"

type Task = {
  id: number
  text: string
  completed: boolean
  dueDate: Date | null
}

type List = {
  id: number
  name: string
  tasks: Task[]
}

export function TodoAppComponent() {
  const [lists, setLists] = useState<List[]>([
    { id: 1, name: "Default List", tasks: [] }
  ])
  const [activeListId, setActiveListId] = useState(1)
  const [newTask, setNewTask] = useState("")
  const [newList, setNewList] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

  const activeList = lists.find(list => list.id === activeListId)

  const addTask = () => {
    if (newTask.trim() && activeList) {
      const updatedLists = lists.map(list =>
        list.id === activeListId
          ? {
              ...list,
              tasks: [
                ...list.tasks,
                { id: Date.now(), text: newTask, completed: false, dueDate: null }
              ]
            }
          : list
      )
      setLists(updatedLists)
      setNewTask("")
    }
  }

  const addList = () => {
    if (newList.trim()) {
      setLists([...lists, { id: Date.now(), name: newList, tasks: [] }])
      setNewList("")
    }
  }

  const toggleTaskCompletion = (taskId: number) => {
    const updatedLists = lists.map(list => ({
      ...list,
      tasks: list.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }))
    setLists(updatedLists)
  }

  const editTask = (taskId: number, newText: string) => {
    const updatedLists = lists.map(list => ({
      ...list,
      tasks: list.tasks.map(task =>
        task.id === taskId ? { ...task, text: newText } : task
      )
    }))
    setLists(updatedLists)
    setEditingTaskId(null)
  }

  const deleteTask = (taskId: number) => {
    const updatedLists = lists.map(list => ({
      ...list,
      tasks: list.tasks.filter(task => task.id !== taskId)
    }))
    setLists(updatedLists)
  }

  const setTaskDueDate = (taskId: number, date: Date | null) => {
    const updatedLists = lists.map(list => ({
      ...list,
      tasks: list.tasks.map(task =>
        task.id === taskId ? { ...task, dueDate: date } : task
      )
    }))
    setLists(updatedLists)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      
      <div className="flex mb-4">
        <Input
          type="text"
          value={newList}
          onChange={(e) => setNewList(e.target.value)}
          placeholder="New list name"
          className="mr-2"
        />
        <Button onClick={addList}>Add List</Button>
      </div>

      <div className="flex mb-4">
        {lists.map(list => (
          <Button
            key={list.id}
            onClick={() => setActiveListId(list.id)}
            variant={list.id === activeListId ? "default" : "outline"}
            className="mr-2"
          >
            {list.name}
          </Button>
        ))}
      </div>

      {activeList && (
        <>
          <div className="flex mb-4">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task"
              className="mr-2"
            />
            <Button onClick={addTask}>Add Task</Button>
          </div>

          <ul className="space-y-2">
            {activeList.tasks.map(task => (
              <li key={task.id} className="flex items-center space-x-2 bg-secondary p-2 rounded">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                {editingTaskId === task.id ? (
                  <Input
                    type="text"
                    value={task.text}
                    onChange={(e) => editTask(task.id, e.target.value)}
                    onBlur={() => setEditingTaskId(null)}
                    autoFocus
                  />
                ) : (
                  <span className={task.completed ? "line-through" : ""}>{task.text}</span>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      <CalendarIcon className="h-4 w-4" />
                      {task.dueDate ? format(task.dueDate, "PPP") : "Set due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={task.dueDate || undefined}
                      onSelect={(date) => setTaskDueDate(task.id, date || null)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="ghost" size="icon" onClick={() => setEditingTaskId(task.id)}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}