defmodule MchatServer.PubSubHandler do
  use MchatServer.SocketHandler

  alias MchatServer.PubSub

  def handle_message(json) do
    message = Jason.decode!(json, keys: :atoms)

    case message do
      %{action: "join", channel: _} ->
        PubSub.subscribe(message.channel)

      %{action: "message", channel: _, message: _} ->
        PubSub.broadcast(message.message, message.channel)
    end
  end
end
