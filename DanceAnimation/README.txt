

Section1. Dance Animation

1.Usage
This section is a web application for Dance Animation.
https://cs1.ucc.ie/~yl5/D_demo/DanceAnimation/DanceAnimation/DanceAnimation.html

Users can choose a file from the folder "AudioSources" or their own audio files to drive dancing animation.
All testing files in "AudioSources" are from https://freemp3cloud.com/en/.





--------------------------------------------------------------------------------

Section2. Lip-Sync Animation


This section contains two phases: 1. Song generation; 2. Lip-sync generation.
1. Song generation

This is a song generator which combines a music generator, a lyrics generator, and a voice generator.

All the three parts need to be executed in order on the Google Colab.

The music generator is based on Magenta, the lyrics generator is based on GPT-2 model,
and the voice generator is using a Python library "midi2voice".

Click on the run button of each code block.

After all the code are executed, a midi file, a lyrics.txt file, a voice.wav file will be downloaded.

The lyrics.txt file and the voice.wav file will be used in Lip-sync generation.

2. Lip-sync generation

2.1 Installation
2.1.1 Install Blender
https://www.blender.org/download/
Download Blender of the latest version.
Install on the PC.

2.1.2 Install Rhubarb Lipsync Add-on in blender
After Installation, launch it, and install the Rhubarb Lipsync add-on as below:
  Edit->Preferences->Add-ons
  Search "Rhubarb Lipsync", then install it.


2.2 Generate Lip Sync

Import the prepared model.
In the "Object data properties", the voice.wav file can be upload to generate the lip-sync animation,
The lyrics.txt file can be uploaded optionally.
By clicking on the "Rhubarb lipsync" button, keyframes will be generated automatically.
