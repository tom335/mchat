defmodule MchatServer.PubSub do
  def subscribe(topic) do
    Registry.MchatServer |> Registry.register(topic, {})
    {:ok, topic}
  end

  def unsubscribe(topic) do
    Registry.MchatServer |> Registry.unregister(topic)
    {:ok, topic}
  end

  def broadcast(message, topic) do
    Registry.MchatServer
    |> Registry.dispatch(topic, fn entries ->
      for {pid, _} <- entries do
        if pid != self() do
          Process.send(pid, message, [])
        end
      end
    end)

    {:ok, topic}
  end
end
