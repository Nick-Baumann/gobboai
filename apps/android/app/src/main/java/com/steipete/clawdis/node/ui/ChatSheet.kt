package com.steipete.clawdis.node.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.steipete.clawdis.node.MainViewModel

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  val messages by viewModel.chatMessages.collectAsState()
  val error by viewModel.chatError.collectAsState()
  val pendingRunCount by viewModel.pendingRunCount.collectAsState()
  var input by remember { mutableStateOf("") }

  LaunchedEffect(Unit) {
    viewModel.loadChat("main")
  }

  Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
    Text("Clawd Chat · session main")

    if (!error.isNullOrBlank()) {
      Text("Error: $error")
    }

    LazyColumn(modifier = Modifier.fillMaxWidth().weight(1f, fill = true)) {
      items(messages) { msg ->
        Text("${msg.role}: ${msg.text}")
      }
      if (pendingRunCount > 0) {
        item { Text("assistant: …") }
      }
    }

    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
      OutlinedTextField(
        value = input,
        onValueChange = { input = it },
        modifier = Modifier.weight(1f),
        label = { Text("Message") },
      )
      Button(
        onClick = {
          val text = input
          input = ""
          viewModel.sendChat("main", text)
        },
        enabled = input.trim().isNotEmpty(),
      ) {
        Text("Send")
      }
    }
  }
}
