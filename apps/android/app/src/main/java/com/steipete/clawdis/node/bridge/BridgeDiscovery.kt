package com.steipete.clawdis.node.bridge

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.os.Build
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.concurrent.ConcurrentHashMap

class BridgeDiscovery(context: Context) {
  private val nsd = context.getSystemService(NsdManager::class.java)
  private val serviceType = "_clawdis-bridge._tcp."

  private val byId = ConcurrentHashMap<String, BridgeEndpoint>()
  private val _bridges = MutableStateFlow<List<BridgeEndpoint>>(emptyList())
  val bridges: StateFlow<List<BridgeEndpoint>> = _bridges.asStateFlow()

  private val discoveryListener =
    object : NsdManager.DiscoveryListener {
      override fun onStartDiscoveryFailed(serviceType: String, errorCode: Int) {}
      override fun onStopDiscoveryFailed(serviceType: String, errorCode: Int) {}
      override fun onDiscoveryStarted(serviceType: String) {}
      override fun onDiscoveryStopped(serviceType: String) {}

      override fun onServiceFound(serviceInfo: NsdServiceInfo) {
        if (serviceInfo.serviceType != this@BridgeDiscovery.serviceType) return
        resolve(serviceInfo)
      }

      override fun onServiceLost(serviceInfo: NsdServiceInfo) {
        val id = stableId(serviceInfo)
        byId.remove(id)
        publish()
      }
    }

  init {
    try {
      nsd.discoverServices(serviceType, NsdManager.PROTOCOL_DNS_SD, discoveryListener)
    } catch (_: Throwable) {
      // ignore (best-effort)
    }
  }

  private fun resolve(serviceInfo: NsdServiceInfo) {
    nsd.resolveService(
      serviceInfo,
      object : NsdManager.ResolveListener {
        override fun onResolveFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {}

        override fun onServiceResolved(resolved: NsdServiceInfo) {
          val host = resolved.host?.hostAddress ?: return
          val port = resolved.port
          if (port <= 0) return

          val displayName = txt(resolved, "displayName") ?: resolved.serviceName
          val id = stableId(resolved)
          byId[id] = BridgeEndpoint(stableId = id, name = displayName, host = host, port = port)
          publish()
        }
      },
    )
  }

  private fun publish() {
    _bridges.value = byId.values.sortedBy { it.name.lowercase() }
  }

  private fun stableId(info: NsdServiceInfo): String {
    return "${info.serviceType}|local.|${normalizeName(info.serviceName)}"
  }

  private fun normalizeName(raw: String): String {
    return raw.trim().split(Regex("\\s+")).joinToString(" ")
  }

  private fun txt(info: NsdServiceInfo, key: String): String? {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) return null
    val bytes = info.attributes[key] ?: return null
    return try {
      String(bytes, Charsets.UTF_8).trim().ifEmpty { null }
    } catch (_: Throwable) {
      null
    }
  }
}
