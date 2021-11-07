defmodule MchatServer.SocketHandler do
  @behaviour :cowboy_websocket

  require Logger
  alias MchatServer.PubSub


  def init(request, state) do
    {:cowboy_websocket, request, state}
  end

  def websocket_init(state) do
    {:ok, state}
  end

  def websocket_handle({:text, json}, state) do
    handle_message(json)

    {:reply, {:text, json}, state}
  end

  def websocket_info(info, state) do
    Logger.info "websocket_info :: message :: " <> info
    m = Jason.encode!(%{message: info})

    {:reply, {:text, m}, state}
  end

  defp handle_message(json) do
    message = Jason.decode!(json, [keys: :atoms])

    case message do
      %{action: "join", channel: _} ->
        PubSub.subscribe(message.channel)
      %{action: "message", channel: _, message: _} ->
        PubSub.broadcast(message.message, message.channel)
    end
  end
end
