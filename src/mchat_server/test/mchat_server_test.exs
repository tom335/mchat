defmodule MchatServerTest do
  use ExUnit.Case
  doctest MchatServer

  test "greets the world" do
    assert MchatServer.hello() == :world
  end
end
