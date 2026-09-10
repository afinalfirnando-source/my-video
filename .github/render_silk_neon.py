import bpy, math, mathutils, bmesh, os
import sys

scene = bpy.context.scene
RENDER_DIR = "/tmp/renders"
os.makedirs(RENDER_DIR, exist_ok=True)

scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100
scene.render.fps = 60
scene.frame_start = 1
scene.frame_end = 900
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
scene.render.image_settings.color_depth = '8'
scene.render.use_file_extension = True
scene.eevee.taa_render_samples = 8
scene.eevee.taa_samples = 8

world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs[0].default_value = (0.0, 0.0, 0.0, 1.0)
    bg.inputs[1].default_value = 0.01

bpy.ops.mesh.primitive_grid_add(x_subdivisions=100, y_subdivisions=100, size=15, location=(0, 0, 0))
plane = bpy.context.object
plane.name = "SilkWavesPlane"

subdiv = plane.modifiers.new("Subdivision", 'SUBSURF')
subdiv.levels = 2
subdiv.render_levels = 2
subdiv.subdivision_type = 'SIMPLE'

noise_tex = bpy.data.textures.new("CloudNoise", type='NOISE')
noise_tex.intensity = 1.0
noise_tex.contrast = 0.5
noise_tex.use_color_ramp = True
cr = noise_tex.color_ramp
cr.elements[0].position = 0.0
cr.elements[0].color = (0.0, 0.0, 0.0, 1.0)
cr.elements[1].position = 0.5
cr.elements[1].color = (0.5, 0.5, 0.5, 1.0)
cr.elements[-1].position = 1.0
cr.elements[-1].color = (1.0, 1.0, 1.0, 1.0)

displace = plane.modifiers.new("DisplaceClouds", 'DISPLACE')
displace.texture = noise_tex
displace.strength = 3.0
displace.mid_level = 0.5
displace.texture_coords = 'OBJECT'

empty = bpy.data.objects.new("WaveMotionController", None)
scene.collection.objects.link(empty)
displace.texture_coords_object = empty

mat = bpy.data.materials.new("NeonSilkMaterial")
mat.use_nodes = True
plane.data.materials.append(mat)

nt = mat.node_tree
nt.nodes.clear()

noise_n = nt.nodes.new('ShaderNodeTexNoise')
noise_n.inputs['Scale'].default_value = 4.0
noise_n.inputs['Detail'].default_value = 3.0

mapping_n = nt.nodes.new('ShaderNodeMapping')
coord_n = nt.nodes.new('ShaderNodeTexCoord')
nt.links.new(coord_n.outputs['Generated'], mapping_n.inputs['Vector'])
nt.links.new(mapping_n.outputs['Vector'], noise_n.inputs['Vector'])

map_r = nt.nodes.new('ShaderNodeMapRange')
map_r.inputs['From Min'].default_value = 0.0
map_r.inputs['From Max'].default_value = 1.0
map_r.inputs['To Min'].default_value = -0.5
map_r.inputs['To Max'].default_value = 0.5
nt.links.new(noise_n.outputs['Fac'], map_r.inputs['Value'])

bump_n = nt.nodes.new('ShaderNodeBump')
bump_n.inputs['Strength'].default_value = 0.5
nt.links.new(map_r.outputs['Result'], bump_n.inputs['Height'])

bsdf = nt.nodes.new('ShaderNodeBsdfPrincipled')
bsdf.inputs['Base Color'].default_value = (0.12, 0.01, 0.3, 1.0)
bsdf.inputs['Metallic'].default_value = 0.95
bsdf.inputs['Roughness'].default_value = 0.08
bsdf.inputs['Specular'].default_value = 0.5
bsdf.inputs['Emission'].default_value = (0.9, 0.4, 0.95, 1.0)
bsdf.inputs['Emission Strength'].default_value = 0.1
nt.links.new(bump_n.outputs['Normal'], bsdf.inputs['Normal'])

out_n = nt.nodes.new('ShaderNodeOutputMaterial')
nt.links.new(bsdf.outputs['BSDF'], out_n.inputs['Surface'])

key_d = bpy.data.lights.new("Key_Light", type='AREA')
key_d.energy = 8.0
key_d.color = (0.0, 0.5, 1.0)
key_d.size = 3.0
key_l = bpy.data.objects.new("KeyLight_Cyan", key_d)
scene.collection.objects.link(key_l)
key_l.location = (10, -15, 10)
key_l.rotation_euler = (math.radians(35), math.radians(8), 0)

fill_d = bpy.data.lights.new("Fill_Light", type='AREA')
fill_d.energy = 3.0
fill_d.color = (1.0, 0.05, 0.5)
fill_d.size = 2.5
fill_l = bpy.data.objects.new("FillLight_Magenta", fill_d)
scene.collection.objects.link(fill_l)
fill_l.location = (-12, -12, 8)

rim_d = bpy.data.lights.new("Rim_Light", type='AREA')
rim_d.energy = 5.0
rim_d.color = (1.0, 0.65, 0.05)
rim_d.size = 4.0
rim_l = bpy.data.objects.new("RimLight_Gold", rim_d)
scene.collection.objects.link(rim_l)
rim_l.location = (2, 15, 10)

cam_d = bpy.data.cameras.new("Camera")
cam = bpy.data.objects.new("LowAngleCamera", cam_d)
scene.collection.objects.link(cam)
scene.camera = cam
cam.location = (0, -12, 5)
cam.rotation_euler = (math.radians(70), 0, 0)
cam_d.lens = 35

def setup_loop(obj_or_data):
    ad = obj_or_data.animation_data
    if not ad or not ad.action: return
    action = ad.action
    action.use_cyclic = True

cf_frames = [1, 225, 450, 675, 900]

R_tx = 4.0
cpos = [(0,R_tx,0),(R_tx,0,0),(0,-R_tx,0),(-R_tx,0,0),(0,R_tx,0)]
for f, p in zip(cf_frames, cpos):
    scene.frame_set(f)
    empty.location = p
    empty.keyframe_insert(data_path="location", frame=f)
setup_loop(empty)

iv = [0.8, 1.0, 0.8, 0.6, 0.8]
for f, v in zip(cf_frames, iv):
    scene.frame_set(f)
    noise_tex.intensity = v
    noise_tex.keyframe_insert(data_path="intensity", frame=f)
setup_loop(noise_tex)

mv = [(0,0,0),(1,0,0),(0,0,0),(-1,0,0),(0,0,0)]
for f, v in zip(cf_frames, mv):
    scene.frame_set(f)
    mapping_n.inputs['Location'].default_value = mathutils.Vector(v)
    try:
        mat.keyframe_insert(data_path=f'node_tree.nodes["{mapping_n.name}"].inputs["Location"].default_value', frame=f)
    except:
        pass
if mat.animation_data and mat.animation_data.action:
    mat.animation_data.action.use_cyclic = True

for f, p in zip([1, 450, 900], [(0.2,-12,5),(-0.2,-12,5),(0.2,-12,5)]):
    scene.frame_set(f)
    cam.location = p
    cam.keyframe_insert(data_path="location", frame=f)
setup_loop(cam)

cm = [1.0, 1.2, 1.0, 0.8, 1.0]
fm = [1.0, 0.8, 1.0, 1.2, 1.0]
gm = [1.0, 1.1, 1.0, 1.1, 1.0]
for f, c, m, g in zip(cf_frames, cm, fm, gm):
    scene.frame_set(f)
    key_d.energy = 8.0*c; key_d.keyframe_insert(data_path="energy", frame=f)
    fill_d.energy = 3.0*m; fill_d.keyframe_insert(data_path="energy", frame=f)
    rim_d.energy = 5.0*g; rim_d.keyframe_insert(data_path="energy", frame=f)
setup_loop(key_l.data)
setup_loop(fill_l.data)
setup_loop(rim_l.data)

scene.use_nodes = True
tree = scene.node_tree
tree.nodes.clear()

rl = tree.nodes.new('CompositorNodeRLayers')

glare = tree.nodes.new('CompositorNodeGlare')
glare.glare_type = 'FOG_GLOW'
glare.mix = 0.5  # Strength
glare.iterations = 2

hue = tree.nodes.new('CompositorNodeHueSat')
hue.inputs['Saturation'].default_value = 1.1
hue.inputs['Value'].default_value = 1.1

out_node = tree.nodes.new('CompositorNodeComposite')

tree.links.new(rl.outputs['Image'], glare.inputs['Image'])
tree.links.new(glare.outputs['Image'], hue.inputs['Image'])
tree.links.new(hue.outputs['Image'], out_node.inputs['Image'])

scene.frame_set(1)
print(">>> RENDERING ", scene.frame_start, "to", scene.frame_end, "<<<")

scene.render.filepath = RENDER_DIR + "/frame_"
bpy.ops.render.render(animation=True, write_still=True)
print(">>> RENDER COMPLETE <<<")
