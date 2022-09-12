package main

import (
	"context"
	"os"
	"strings"

	"github.com/bwmarrin/discordgo"
)

type CommandHandler func(context.Context, *discordgo.Session, *discordgo.MessageCreate)

var commandHandlers map[string]CommandHandler

func initMonitors(ctx context.Context, s *discordgo.Session) {
  // Add a handler to listen for in-message commands. Those are commands that start
  // with our ! prefix. The handler will be called with a context that contains the
  // message that triggered the command.
  s.AddHandler(func(s *discordgo.Session, m *discordgo.MessageCreate) {
    // Don't let the bot answer itself.
    if m.Author.ID == s.State.User.ID {
      return
    }

    // Grab the first word of the message.
    // TODO: This is a very naive way of doing this.
    firstWord := strings.Split(m.Content, " ")[0]
    if strings.HasPrefix(firstWord, "!") {
      // Remove the ! from the command.
      command := strings.TrimPrefix(firstWord, "!")
      // Check if the command exists.
      if commandHandler, ok := commandHandlers[strings.ToLower(command)]; ok {
        // Run the command.
        commandHandler(ctx, s, m)
      }
    }
  })

  commandHandlers = make(map[string]CommandHandler)
  commandHandlers["botinfo"] = botinfoCommand
}

func botinfoCommand(ctx context.Context, s *discordgo.Session, m *discordgo.MessageCreate) {
  s.ChannelMessageSend(m.ChannelID, "Derp is a chatbot.\nsha: " + os.Getenv("GIT_SHA"))
}
